import { Parser, createParser } from 'discord-cmd-parser';
import { readCommandsDir } from './functions/readCommandsDir';
import { parseCommandTree } from './functions/parseCommandTree';
import { GuildMember } from 'discord.js';
export interface CommandFile {
	usage: string;
	description: string;
	aliases: Array<string>;
	builder?: Array<string>;
	delay: number;
	adminOnly?: boolean;
	moderOnly?: boolean;
	ownerOnly?: boolean;
	exec: Function;
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
	exec: Function;
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


export class CommandHandler {
	private prefix: string;
	private useQuotes: boolean;
	private quotesType: string;
	private namedSeparator: string;
	private commandsDir: string | Array<string>;
	private commands: Map<string, Command>;
	private aliases: Map<string, Alias>;
	private parser : Parser;
	constructor(options: Options, commandsDir: string | Array<string>) {
		this.useQuotes = options.useQuotes || true;
		this.quotesType = options.quotesType || '"';
		this.namedSeparator = options.namedSeparator || '-';
		this.commandsDir = commandsDir;
		this.commands = new Map();
		this.aliases = new Map();
		this.parser = createParser({
			useQuotes: this.useQuotes,
			quotesType: this.quotesType,	
		});
		this.init()
	}
	public get Commands() {
		return this.commands;
	}
	public get UseQuotes() {
		return this.useQuotes;
	}
	public get QuotesType() {
		return this.quotesType;
	}
	public get NamedSeparator() {
		return this.namedSeparator;
	}
	public get Aliases() {
		return this.aliases
	}
	public disableQuotes(): void {
		this.useQuotes = false
		this.parser = createParser({
			useQuotes: this.useQuotes,
			quotesType: this.quotesType,
		});
	}
	public enableQuotes(): void {
		this.useQuotes = true
		this.parser = createParser({
			useQuotes: this.useQuotes,
			quotesType: this.quotesType,
			
		});
	}
	public setNamedSeparator(separator: string): void {
		this.namedSeparator = separator
		this.parser = createParser({
			useQuotes: this.useQuotes,
			quotesType: this.quotesType,
			
		});
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
			return this.commands.get(this.aliases.get(command)!.name);
		}
	}
	private init(): void {
		const { aliases, commands } = readCommandsDir(this.commandsDir);
		this.commands = commands;
		this.aliases = aliases;
	}
	private hasPrefix(prefix:string, string: string) {
		if (string.trim().slice(0, prefix.length) !== prefix) return false;
		return true;
	}
	/**
	 * Parse command from string
	 * @param {string} string - string to parse
	 */
	public command(prefix: string, string: string): Promise<{ cmd: Command, exist: Boolean; exec: Function }> {
		return new Promise((resolve, reject) => {
			if (!this.hasPrefix(prefix, string)) return;
			let args = this.parser.parse(string)
			if(args.length === 0) return;
			let cmd = this.getCommand(args.shift()!.trim().slice(prefix.length));
			if (!cmd) return reject('Command not found.');

			const parseResult = parseCommandTree(cmd, args);
			args = parseResult.args;
			cmd = parseResult.cmds[parseResult.cmds.length - 1]
			return resolve( {
				cmd: cmd,
				exist: true,
				exec(caller: GuildMember, customArgs: any) {
					if (!caller || !cmd ) {
						return;
					}	
					return cmd.exec(caller, args, customArgs);
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