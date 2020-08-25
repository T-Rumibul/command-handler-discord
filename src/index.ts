import Events from 'events';
import { Parser, init as parser } from 'discord-cmd-parser';
import { readCommandsDir } from './functions/readCommandsDir';
import { parseCommandTree } from './functions/parseCommandTree';

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
	prefix: string;
	useQuotes: boolean;
	quotesType: string;
	namedSeparator: string;
}

export interface CommandHandler {
	options: Options;
	commandsDir: string;
	commands: Map<string, Command>;
	aliases: Map<string, Alias>;
	parser: Parser;
}

export class CommandHandler extends Events.EventEmitter {
	constructor(options: Options, commandsDir: string) {
		super();
		this.options = options;
		this.commandsDir = commandsDir;
		const { aliases, commands } = readCommandsDir(this.commandsDir);
		this.commands = commands;
		this.aliases = aliases;
		this.parser = parser(this.options);
	}

	/**
	 * Parse command from string and return command object
	 * @param {string} string - string to parse
	 */
	public command(string: string) {
		const { command, args } = this.parser.getCommand(string).parseArgs();
		if (command.length === 0) return false;
		let cmd;
		if (this.commands.has(command)) {
			cmd = this.commands.get(command);
		} else if (this.aliases.has(command)) {
			cmd = this.commands.get(this.aliases.get(command).name);
		} else return;

		const cmds = parseCommandTree(cmd, args);
		return cmds;
	}
}

/** Initialize command handler instance with provided options
 * @param {options} options
 * @returns {CommandHandler}
 */
export function init(commandsDir: string, options?: Options): CommandHandler {
	return new CommandHandler(options, commandsDir);
}

export default init;
