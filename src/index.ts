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

interface Alias {
	name: string;
	builder: Map<string, Alias>;
}

interface CommandHandler {
	options: Options;
	commandsDir: string;
	commands: Map<string, Command>;
	aliases: Map<string, Alias>;
}
class CommandHandler extends Events.EventEmitter {
	constructor(options: Options, commandsDir: string) {
		super();
		this.options = options;
		this.commandsDir = commandsDir;
	}

	private readCommand(
		file: string,
		dir: string
	): { cmdInst: Command; aliases: Map<string, Alias>; name: string } {
		log(file);
		const cmdFile = require(path.resolve(dir, file));
		// replace file extensions
		const cmdName = file.replace(/\.js|\.ts/, '');
		const cmd = {
			name: cmdName,
			aliases: new Map(),
			cmdInst: {
				...cmdFile,
				builder: new Map(),
			},
		};
		const builderAliases = new Map();

		// if builder commands defined, call read dir with builder commands
		if (cmdFile.builder && cmdFile.builder.length !== 0) {
			const subCmds = this.readCommandsDir(`${dir}/${cmdName}_builder`);
			// iterate through array of cmd's and check if such builder command exists
			subCmds.commands.forEach((value, key) => {
				cmdFile.builder.forEach((subCmdName: string) => {
					if (key === subCmdName) {
						cmd.cmdInst.builder.set(key, value);

						// iterate through array with aliases an check if such command exists
						subCmds.aliases.forEach((valueJ, keyJ) => {
							if (valueJ.name === subCmdName) {
								builderAliases.set(keyJ, {
									name: valueJ.name,
									builder: valueJ.builder,
								});
							}
						});
					}
				});
			});
		}

		// iterate through array with command aliases and asign each to aliases property
		cmd.cmdInst.aliases.forEach((alias: string) => {
			cmd.aliases.set(alias, { name: cmd.name, builder: builderAliases });
		});

		return cmd;
	}
	/** Recursively iterater through directory's and files and returns Commands and Aliases*/

	private readCommandsDir(dir: string = this.commandsDir) {
		if (!existsSync(path.resolve(dir))) return { aliases: new Map(), commands: new Map() };

		const files = readdirSync(path.resolve(dir));

		const commands: Map<string, Command> = new Map();
		const aliases: Map<string, Alias> = new Map();
		files.forEach((file) => {
			// Check for directory and for js or ts file
			if (path.extname(file).match(/\.js|\.ts/) === null) return;
			if (lstatSync(path.resolve(dir, file)).isDirectory()) return;

			const cmd = this.readCommand(file, dir);

			commands.set(cmd.name, cmd.cmdInst);

			cmd.aliases.forEach((value, key) => {
				aliases.set(key, value);
			});
		});
		return { aliases, commands };
	}
	init() {
		const { aliases, commands } = this.readCommandsDir();
		this.commands = commands;
		this.aliases = aliases;
	}
}

/** Initialize command handler instance with provided options
 * @param {options} options
 * @returns {CommandHandler}
 */
export function init(commandsDir: string, options?: Options): CommandHandler {
	const handler = new CommandHandler(options, commandsDir);

	handler.init();
	return handler;
}

export default init;
