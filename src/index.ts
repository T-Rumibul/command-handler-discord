import debug from 'debug';
import { readdirSync, existsSync, lstatSync } from 'fs';
import Events from 'events';
import path from 'path';
const log = debug('Command:INFO');
const logDeep = debug('Command:DEEP_INFO');

interface Options {
	prefix: string;
	useQuotes: boolean;
	quotesType: string;
	namedSeparator: string;
}

interface CommandFile {
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
interface Command {
	name: string;
	usage: string;
	description: string;
	aliases: Array<string>;
	builder?: Array<CommandFile>;
	delay: number;
	adminOnly?: boolean;
	moderOnly?: boolean;
	ownerOnly?: boolean;
	exec?: Function;
}

interface CommandHandler {
	options: Options;
	commandsDir: string;
	commands: Map<string, Command>;
	aliases: Map<string, string>;
}
class CommandHandler extends Events.EventEmitter {
	constructor(options: Options, commandsDir: string) {
		super();
		this.options = options;
		this.commandsDir = commandsDir;
	}
	private readCommand(file: string, dir: string): Command {
		log(file);
		const cmdFile = require(path.resolve(dir, file));
		const cmdName = file.replace(/\.js|\.ts/, '');
		const cmd = {
			name: cmdName,
			...cmdFile,
			builder: [],
		};
		if (cmdFile.builder && cmdFile.builder.length !== 0) {
			const subCmds = this.readCommandsDir(`${dir}/${cmdName}_builder`);
			subCmds.forEach((subCmd) => {
				cmdFile.builder.forEach((subCmdName: string) => {
					if (subCmd.name === subCmdName) {
						cmd.builder.push(subCmd);
					}
				});
			});
		}
		return cmd;
	}
	private readCommandsDir(dir: string) {
		if (!existsSync(path.resolve(dir))) return;
		const files = readdirSync(path.resolve(dir));
		const commands: Array<Command> = [];
		files.forEach((file) => {
			if (lstatSync(path.resolve(dir, file)).isDirectory()) return;
			commands.push(this.readCommand(file, dir));
		});
		return commands;
	}
	public init() {
		return this.readCommandsDir(this.commandsDir);
	}
}

/** Initialize command handler instance with provided options
 * @param {options} options
 * @returns {CommandHandler}
 */
export function init(commandsDir: string, options?: Options): Array<Command> {
	return new CommandHandler(options, commandsDir).init();
}

export default init;
