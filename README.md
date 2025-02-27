  

# Command handler discord
 [![NPM](https://img.shields.io/npm/l/command-handler-discord?style=for-the-badge)](https://github.com/T-Rumibul/command-handler-discord/blob/master/LICENSE)

## Installation

```sh
yarn add command-handler-discord
or
npm install command-handler-discord

```
1000000 - 5.490s
1 - 1.95 - 5ms
## Usage
```js
// Import package in your project
const Handler = require('command-handler-discord');

// Initialize with commands directory path and options, command file name will be command name and parser will try to found builder command in with name COMMAND-NAME_builder
const Handler = Handler.createHandler('./myCommands', {
  pefix: "!", // see https://www.npmjs.com/package/discord-cmd-parser
  useQuotes: true, // see https://www.npmjs.com/package/discord-cmd-parser
  namedSeparator: "-", // see https://www.npmjs.com/package/discord-cmd-parser
  quotesType: '"', // see https://www.npmjs.com/package/discord-cmd-parser
  checkParentPermission: true, // iterate from current command to its parrent and check if command caller match permisions lever for each of them
  adminRoles: [] // admin roles ids
  modRoles: [] // mod roles ids
})
 // Command name equal to filename without .js extension
 // Command file code example
 // filename: test.js
 module.exports = {
	description: '5',
	aliases: ['alias_test'], // only if you need aliases for command
	builder: ['test_2'], // only if you need builder commands
  delay: 5,
  exec: (caller: GuildMember, args) => {} // required
};
// Builder commands should go into separate folder with name [parent_command_name]_builder and file should have a name like in builder array of parrent command.
// Builder command file example
// filename: test_2.js
module.exports = {

	description: 'some description',
	aliases: ['alias_test_2'], // only if you need aliases for command
	delay: 5,
  builder: ['test_3'], // only if you need builder command
  exec: (caller: GuildMember, args) => {} // required
};
// You can define other filds in your command file, they will be parsed and you can use as you like

Handler.command("!test test_2") // Will return promise, promise will be resolved if command is found and rejected if not. use this to check if the command exists
// Example of the resolve value
{
  args // args without command names and alises see https://www.npmjs.com/package/discord-cmd-parser
  cmd // there will be the test_2 command object
  cmds // array of commands, that are the chain to invoked command, in that case there will be [test command object, test_2 command object]
  exec(caller: GuildMember, ?customArgs: any) //  will invoke exec function from test_2 command
}

```
## Methods

| Method | return | Description |
| ------ | ------ | ----------- |
| command(string: string) | Promise<{ args, cmd, cmds, ecec() }> | Parses command and args from string.|
| setPrefix(prefix: string) | void | Set a new prefix for commands |
| disableQuotes() | void | Disable long args in quotes |
| enableQuotes() | void | Enable long args in quotes |
| setNamedSeparator(separator: string) | void | Set a new named separator |
| reinit(commandsDir: string | string[]) | void | reinit handler with a new commands directory


## Properties

| Propetry | return | Description |
| ------ | ------ | ----------- |
| Commands | Map<commandName:string, command: Command> | Map object with commands.|
| Aliases | Map<commandAlias:string, command: Command> | Map object with aliases.|


## License

[MIT License](https://github.com/T-Rumibul/command-handler-discord/blob/master/LICENSE)

Copyright (c) 2020 [T-Rumibul](https://github.com/T-Rumibul) <t.rumibul.work@gmail.com>
