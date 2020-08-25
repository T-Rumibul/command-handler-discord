import { Command } from '../index';
export function hasBuilder(cmd: Command) {
	if (cmd.builder.size > 0) return true;
	return false;
}
