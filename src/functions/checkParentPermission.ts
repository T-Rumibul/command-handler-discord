import { GuildMember } from 'discord.js';
import { Command } from '../index';
import { checkCmdPermission } from './checkCmdPermission';
interface Options {
	adminRoles: string[];
	modRoles: string[];
}

export function checkParentPermission(cmds: Command[], caller: GuildMember, options: Options) {
	const cmdsReversed = cmds.reverse();
	for (let cmd of cmdsReversed) {
		checkCmdPermission(cmd, caller, options);
	}
	return true;
}
