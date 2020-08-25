import { Command } from '../index';
import { hasBuilder } from '../utils/hasBuilder';
import { args } from 'discord-cmd-parser';
export function parseCommandTree(cmd: Command, args: any, cmds?: Array<Command>) {
	if (!Array.isArray(cmds)) cmds = [cmd];
	if (!hasBuilder(cmd)) return cmds;
}
