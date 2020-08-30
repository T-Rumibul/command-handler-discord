import { GuildMember } from 'discord.js';

export function isOwner(caller: GuildMember) {
	if (caller.id === caller.guild.ownerID) {
		return true;
	}
	return false;
}
