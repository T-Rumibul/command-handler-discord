import { readdirSync, existsSync, lstatSync } from 'fs';
import path from 'path';
import { Alias, Command } from '../index';
import { readCommand } from './readCommand';

/** Recursively iterater through directory's and files and returns Commands and Aliases*/
export function readCommandsDir(dir: string) {
	if (!existsSync(path.resolve(dir))) return { aliases: new Map(), commands: new Map() };

	const files = readdirSync(path.resolve(dir));

	const commands: Map<string, Command> = new Map();
	const aliases: Map<string, Alias> = new Map();
	files.forEach((file) => {
		// Check for directory and for js or ts file
		if (path.extname(file).match(/\.js|\.ts/) === null) return;
		if (lstatSync(path.resolve(dir, file)).isDirectory()) return;

		const cmd = readCommand(file, dir);

		commands.set(cmd.name, cmd.cmdInst);

		cmd.aliases.forEach((value, key) => {
			aliases.set(key, value);
		});
	});
	return { aliases, commands };
}
