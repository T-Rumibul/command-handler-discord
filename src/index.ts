import Events from 'events';
import { Parser, createParser } from 'discord-cmd-parser';
import { readCommandsDir } from './functions/readCommandsDir';
import { parseCommandTree } from './functions/parseCommandTree';
import { checkParentPermission } from './functions/checkParentPermission';
import { GuildMember } from 'discord.js';
import { checkCmdPermission } from './functions/checkCmdPermission';
import { args as Args } from 'discord-cmd-parser';
export interface CommandFile {
	usage: string;
	description: string;
	aliases: Array<string>;
	builder?: Array<string>;
	delay: number;
	adminOnly?: boolean;
	moderOnly?: boolean;
	ownerOnly?: boolean;
	exec?: Function;
}
export interface Command {
	usage: string;
	description: string;
	aliases: Array<string>;
	builder?: Map<string, Command>;
	delay: number;
	adminOnly?: boolean;
	moderOnly?: boolean;
	ownerOnly?: boolean;
	exec?: Function;
}

export interface Alias {
	name: string;
	builder: Map<string, Alias>;
}

export interface Options {
	prefix?: string;
	useQuotes?: boolean;
	quotesType?: string;
	namedSeparator?: string;
	checkParentPermission?: boolean;
	adminRoles?: string[];
	modRoles?: string[];
}

export interface CommandHandler {
	prefix: string;
	useQuotes: boolean;
	quotesType: string;
	namedSeparator: string;
	checkParentPermission: boolean;
	adminRoles: string[];
	modRoles: string[];
	commandsDir: string;
	commands: Map<string, Command>;
	aliases: Map<string, Alias>;
	parser: Parser;
}

export class CommandHandler extends Events.EventEmitter {
	constructor(options: Options, commandsDir: string) {
		super();
		this.prefix = options.prefix || '!';
		this.useQuotes = options.useQuotes || true;
		this.quotesType = options.quotesType || '"';
		this.namedSeparator = options.namedSeparator || '-';
		this.checkParentPermission = options.checkParentPermission || true;
		this.adminRoles = options.adminRoles || [];
		this.modRoles = options.modRoles || [];
		this.commandsDir = commandsDir;
		const { aliases, commands } = readCommandsDir(this.commandsDir);
		this.commands = commands;
		this.aliases = aliases;
		this.parser = createParser({
			prefix: this.prefix,
			useQuotes: this.useQuotes,
			quotesType: this.quotesType,
			namedSeparator: this.namedSeparator,
		});
	}

	public addAdminRole(id: string) {
		this.adminRoles.push(id);
	}
	public addModRole(id: string) {
		this.modRoles.push(id);
	}
	public removeAdminRole(id: string) {
		this.adminRoles.splice(this.adminRoles.indexOf(id), 1);
	}
	public removeModRole(id: string) {
		this.modRoles.splice(this.modRoles.indexOf(id), 1);
	}
	public hasCommand(command: string) {
		if (command.length === 0) return false;
		if (this.commands.has(command)) {
			return true;
		}
		return false;
	}
	public hasAlias(command: string) {
		if (command.length === 0) return false;
		if (this.aliases.has(command)) {
			return true;
		}
		return false;
	}
	public getCommand(command: string) {
		if (this.hasCommand(command)) {
			return this.commands.get(command);
		}
		if (this.hasAlias(command)) {
			return this.commands.get(this.aliases.get(command).name);
		}
	}
	/**
	 * Parse command from string
	 * @param {string} string - string to parse
	 */
	public command(
		string: string
	): { args: Args; cmds: Command[]; exist: Boolean; exec: Function } {
		const { command, args } = this.parser.getCommand(string).parseArgs();
		const cmd = this.getCommand(command);
		if (!cmd) return { args: { _: [] }, cmds: [], exec: () => {}, exist: false };
		
		const { args: unamedArgs, cmds } = parseCommandTree(cmd, args._);
		args._ = unamedArgs;
		return {
			args,
			cmds,
			exist: true,
			exec: (caller: GuildMember) => {
				const commandToExec = cmds[cmds.length - 1];
				if (!caller) {
					return this.emit('error', { status: 'Error', message: 'Caller is required' });
				}
				if (this.checkParentPermission) {
					if (
						!checkParentPermission(cmds, caller, {
							adminRoles: this.adminRoles,
							modRoles: this.modRoles,
						})
					)
						return this.emit('reject', {
							status: 'Reject',
							message: 'Caller does not have required permissions',
						});
				} else {
					if (
						!checkCmdPermission(commandToExec, caller, {
							adminRoles: this.adminRoles,
							modRoles: this.modRoles,
						})
					) {
						return this.emit('reject', {
							status: 'Reject',
							message: 'Caller does not have required permissions',
						});
					}
				}
				try {
					this.emit('exec', { command: commandToExec, parrents: cmds, caller: caller });
					commandToExec.exec(caller, args);
				} catch (e) {
					this.emit('error', { status: 'Error', message: e.message });
				}
			},
		};
	}
}

/** Initialize command handler instance with provided options
 * @param {options} options
 * @returns {CommandHandler}
 */
export function createHandler(commandsDir: string, options: Options = {}): CommandHandler {
	return new CommandHandler(options, commandsDir);
}

export default createHandler;
