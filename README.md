  

# Command handler discord
[![Codacy Badge](https://img.shields.io/codacy/grade/f21a6e132aa14835b2dd080b60c46bf9.svg?style=for-the-badge)](https://www.codacy.com/manual/ryner.no/command-handler-discord?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=RynerNO/command-handler-discord&amp;utm_campaign=Badge_Grade) [![NPM](https://img.shields.io/npm/l/command-handler-discord?style=for-the-badge)](https://github.com/RynerNO/command-handler-discord/blob/master/LICENSE) [![donate](https://img.shields.io/badge/donate-Buy%20me%20a%20beer-FF5E5B?style=for-the-badge)](https://www.donationalerts.com/r/rynerno) [![discord](https://img.shields.io/badge/JOIN-DISCORD-7289DA?style=for-the-badge)](https://discord.gg/75NmVJa)

## Installation

```sh
yarn add command-handler-discord
or
npm install command-handler-discord

```

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
```
## Methods

| Method | return | Description |
| ------ | ------ | ----------- |
| command(string: string) | Object | Parses command and args from string.|

## Donation

If you like my project please consider the [donating](https://www.donationalerts.com/r/rynerno) to support me

## Support

If you need help, join my [discord server](https://discord.gg/75NmVJa)

## License

[MIT License](https://github.com/RynerNO/command-handler-discord/blob/master/LICENSE)

Copyright (c) 2020 [RynerNO](https://github.com/RynerNO) <ryner.no@gmail.com>