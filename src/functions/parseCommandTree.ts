import { Command } from '../index';
import { hasBuilder } from '../utils/hasBuilder';
import { args } from 'discord-cmd-parser';
export function parseCommandTree(
	cmd: Command,
	args: args,
	cmds?: Array<Command>
): { args: args; cmds: Array<Command> } {
	if (!Array.isArray(cmds)) cmds = [];
	cmds.push(cmd);
	if (!hasBuilder(cmd)) return { args, cmds };
	if (cmd.builder.has(args[0])) {
		parseCommandTree(cmd.builder.get(args.shift()), args, cmds);
	} else {
		for (let [key, value] of cmd.builder) {
			if (value.aliases.indexOf(args[0]) !== -1) {
				args.shift();
				return parseCommandTree(value, args, cmds);
			}
		}
	}
	return { args, cmds };
}
