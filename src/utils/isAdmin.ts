import { GuildMember, Role } from 'discord.js';

import { isOwner } from './isOwner';
export function isAdmin(caller: GuildMember, adminRoles?: string[]) {
	if (isOwner(caller)) return true;
	if (caller.hasPermission('ADMINISTRATOR')) {
		return true;
	}
	if (adminRoles.length > 0) {
		if (caller.roles.cache.find((r) => adminRoles.indexOf(r.id) !== -1)) {
			return true;
		}
	}
	return false;
}
