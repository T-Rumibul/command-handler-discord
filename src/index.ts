import Events from 'events';
import { Parser, createParser } from 'discord-cmd-parser';
import { readCommandsDir } from './functions/readCommandsDir';
import { parseCommandTree } from './functions/parseCommandTree';
import { GuildMember } from 'discord.js';
import { args as Args } from 'discord-cmd-parser';
import { resolve } from 'path';
import { rejects } from 'assert';
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
}



export class CommandHandler extends Events.EventEmitter {
	private prefix: string;
	private useQuotes: boolean;
	private quotesType: string;
	private namedSeparator: string;
	private commandsDir: string | Array<string>;
	private commands: Map<string, Command>;
	private aliases: Map<string, Alias>;
	private parser : Parser;
	constructor(options: Options, commandsDir: string | Array<string>) {
		super();
		this.prefix = options.prefix || '!';
		this.useQuotes = options.useQuotes || true;
		this.quotesType = options.quotesType || '"';
		this.namedSeparator = options.namedSeparator || '-';
		this.commandsDir = commandsDir;
		
		this.parser = createParser({
			prefix: this.prefix,
			useQuotes: this.useQuotes,
			quotesType: this.quotesType,
			namedSeparator: this.namedSeparator,
		});
		this.init()
	}
	public get Commands() {
		return this.commands;
	}
	public get Aliases() {
		return this.aliases
	}
	public setPrefix(prefix: string): void {
		this.prefix = prefix
	}
	public disableQuotes(): void {
		this.useQuotes = false
	}
	public enableQuotes(): void {
		this.useQuotes = true
	}
	public setNamedSeparator(separator: string): void {
		this.namedSeparator = separator
	}
	public reinit(commandsDir: string | Array<string>) {
		this.commandsDir = commandsDir
		this.init()
	}
	private hasCommand(command: string) {
		if (command.length === 0) return false;
		if (this.commands.has(command)) {
			return true;
		}
		return false;
	}
	
	private hasAlias(command: string) {
		if (command.length === 0) return false;
		if (this.aliases.has(command)) {
			return true;
		}
		return false;
	}
	private getCommand(command: string) {
		if (this.hasCommand(command)) {
			return this.commands.get(command);
		}
		if (this.hasAlias(command)) {
			return this.commands.get(this.aliases.get(command).name);
		}
	}
	private init(): void {
		const { aliases, commands } = readCommandsDir(this.commandsDir);
		this.commands = commands;
		this.aliases = aliases;
	}
	/**
	 * Parse command from string
	 * @param {string} string - string to parse
	 */
	public command(
		string: string
	): Promise<{ args: Args; cmd:Command, cmds: Command[]; exist: Boolean; exec: Function }> {
		return new Promise((resolve, reject) => {
			const { command, args } = this.parser.getCommand(string).parseArgs();
			const cmd = this.getCommand(command);
			if (!cmd) return reject('Command not found.');
			
			const { args: unamedArgs, cmds } = parseCommandTree(cmd, args._);
			args._ = unamedArgs;
			return resolve( {
				args,
				cmd: cmds[cmds.length - 1],
				cmds,
				exist: true,
				exec: (caller: GuildMember) => {
					const commandToExec = cmds[cmds.length - 1];
					if (!caller) {
						return this.emit('error', { status: 'Error', message: 'Caller is required' });
					}
					try {
						this.emit('exec', { command: commandToExec, parrents: cmds, caller: caller });
						commandToExec.exec(caller, args);
					} catch (e) {
						this.emit('error', { status: 'Error', message: e.message });
					}
				},
			})
		
		})
	}
}

/** Initialize command handler instance with provided options
 * @param {options} options
 * @returns {CommandHandler}
 */
export function createHandler(commandsDir: string | Array<string>, options: Options = {}): CommandHandler {
	return new CommandHandler(options, commandsDir);
}

export default createHandler;
