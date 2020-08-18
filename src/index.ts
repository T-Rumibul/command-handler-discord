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
	private readCommand(file: string, dir: string): { cmdInst: Command; name: string } {
		log(file);
		const cmdFile = require(path.resolve(dir, file));
		const cmdName = file.replace(/\.js|\.ts/, '');
		const cmd = {
			name: cmdName,
			cmdInst: {
				...cmdFile,
				builder: new Map(),
			},
		};
		if (cmdFile.builder && cmdFile.builder.length !== 0) {
			const subCmds = this.readCommandsDir(`${dir}/${cmdName}_builder`);
			subCmds.forEach((value, key) => {
				cmdFile.builder.forEach((subCmdName: string) => {
					if (key === subCmdName) {
						cmd.cmdInst.builder.set(key, value);
					}
				});
			});
		}
		return cmd;
	}
	private readCommandsDir(dir: string = this.commandsDir) {
		if (!existsSync(path.resolve(dir))) return;
		const files = readdirSync(path.resolve(dir));
		const commands: Map<string, Command> = new Map();
		files.forEach((file) => {
			if (lstatSync(path.resolve(dir, file)).isDirectory()) return;
			const cmd = this.readCommand(file, dir);
			commands.set(cmd.name, cmd.cmdInst);
		});
		return commands;
	}
	public init() {
		this.commands = this.readCommandsDir();
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
