import { GuildMember } from 'discord.js';
import { isOwner } from './isOwner';
import { isAdmin } from './isAdmin';

export function isMod(caller: GuildMember, modRoles: string[], adminRoles: string[]) {
	if (isAdmin(caller, adminRoles)) return true;
	if (modRoles.length > 0) {
		if (caller.roles.cache.find((r) => modRoles.indexOf(r.name) !== -1)) {
			return true;
		}
	}
}
