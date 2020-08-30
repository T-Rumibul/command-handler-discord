import { isOwner } from '../utils/isOwner';
import { isAdmin } from '../utils/isAdmin';
import { isMod } from '../utils/isMod';
import { GuildMember } from 'discord.js';
import { Command } from '../index';
interface Options {
	adminRoles: string[];
	modRoles: string[];
}

export function checkCmdPermission(
	cmd: Command,
	caller: GuildMember,
	{ adminRoles, modRoles }: Options
) {
	if (cmd.ownerOnly && !isOwner(caller)) return false;
	if (cmd.adminOnly && !isAdmin(caller, adminRoles)) return false;
	if (cmd.moderOnly && !isMod(caller, modRoles, adminRoles)) return false;
	return true;
}
