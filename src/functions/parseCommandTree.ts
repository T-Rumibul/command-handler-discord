import { Command } from '../index';
import { hasBuilder } from '../utils/hasBuilder';
export interface parseCommandTree {
	(cmd: Command, args: string[], cmds?: Array<Command>): { args: string[]; cmds: Array<Command> };
}

export const parseCommandTree: parseCommandTree = (cmd, args, cmds?) => {
	if (!Array.isArray(cmds)) cmds = [];
	cmds.push(cmd);
	if (!hasBuilder(cmd)) return { args, cmds };

	if (cmd.builder!.has(args[0])) {
		parseCommandTree(cmd.builder!.get(args.shift()!)!, args, cmds);
	} else {
		for (let [key, value] of cmd.builder!) {
			if (value.aliases && value.aliases.indexOf(args[0]) !== -1) {
				args.shift();
				return parseCommandTree(value, args, cmds);
			}
		}
	}
	return { args, cmds };
};
