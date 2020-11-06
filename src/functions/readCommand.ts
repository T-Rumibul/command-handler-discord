import { readCommandsDir } from './readCommandsDir';
import path from 'path';
import { Alias, Command, CommandFile } from '../index';
export interface readCommand {
	(file: string, dir: string) : { cmdInst: Command; aliases: Map<string, Alias>; name: string }
}
export const readCommand: readCommand = (file, dir) => {
	const cmdFile: CommandFile = require(path.resolve(dir, file));
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
		const subCmds = readCommandsDir(`${dir}/${cmdName}_builder`);
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
