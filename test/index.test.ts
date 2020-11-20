import CommandHandler from '../src/';
const handler = CommandHandler('./test/test_cmds');


test('Method command using alias', async () => {
	const { args, cmds } = await handler.command('!alias_test test_2 |');
	expect({ args: args, cmds: cmds }).toEqual({
		args: { _: ["|"] },
		cmds: [
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test'],
				builder: new Map([
					[
						'test_2',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test_2'],
							delay: 5,
							builder: new Map([
								[
									'test_3',
									{
										usage: 'test',
										description: '5',
										aliases: ['alias_test'],
										delay: 5,
										builder: new Map(),
									},
								],
							]),
						},
					],
				]),
				delay: 5,
			},
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test_2'],
				delay: 5,
				builder: new Map([
					[
						'test_3',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test'],
							delay: 5,
							builder: new Map(),
						},
					],
				]),
			},
		],
	});
});



test('Parse directory with commands', async () => {
	expect(handler.Commands).toEqual(
		new Map([
			[
				'test_cmd',
				{
					usage: 'test',
					description: '5',
					aliases: ['alias_test'],
					builder: new Map([
						[
							'test_2',
							{
								usage: 'test',
								description: '5',
								aliases: ['alias_test_2'],
								delay: 5,
								builder: new Map([
									[
										'test_3',
										{
											usage: 'test',
											description: '5',
											aliases: ['alias_test'],
											delay: 5,
											builder: new Map(),
										},
									],
								]),
							},
						],
					]),
					delay: 5,
				},
			],
			[
				'test_cmd_2',
				{
					usage: 'test',
					description: '5',
					aliases: ['alias_test_2'],
					builder: new Map(),
					delay: 5,
				},
			],
			[
				'test_cmd_no_alias',
				{
					usage: 'test',
					description: '5',
					builder: new Map([
						[
							'test_cmd_2',
							{
								usage: 'test',
								description: '5',
								builder: new Map(),
								delay: 5,
								
							}
						]
					]),
					delay: 5,
				},
			],
		])
	);
});
test('Parse aliases', async () => {
	expect(
		handler.Aliases.get('alias_test').builder.get('alias_test_2').builder.get('alias_test').name
	).toBe('test_3');
});

test('Method command', async () => {
	const { args, cmds } = await handler.command('!test_cmd test_2');

	expect({ args: args, cmds: cmds }).toEqual({
		args: { _: [] },
		cmds: [
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test'],
				builder: new Map([
					[
						'test_2',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test_2'],
							delay: 5,
							builder: new Map([
								[
									'test_3',
									{
										usage: 'test',
										description: '5',
										aliases: ['alias_test'],
										delay: 5,
										builder: new Map(),
									},
								],
							]),
						},
					],
				]),
				delay: 5,
			},
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test_2'],
				delay: 5,
				builder: new Map([
					[
						'test_3',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test'],
							delay: 5,
							builder: new Map(),
						},
					],
				]),
			},
		],
	});
});


test('Method command using two aliases', async () => {
	const { args, cmds } = await handler.command('!alias_test alias_test_2');
	expect({ args: args, cmds: cmds }).toEqual({
		args: { _: [] },
		cmds: [
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test'],
				builder: new Map([
					[
						'test_2',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test_2'],
							delay: 5,
							builder: new Map([
								[
									'test_3',
									{
										usage: 'test',
										description: '5',
										aliases: ['alias_test'],
										delay: 5,
										builder: new Map(),
									},
								],
							]),
						},
					],
				]),
				delay: 5,
			},
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test_2'],
				delay: 5,
				builder: new Map([
					[
						'test_3',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test'],
							delay: 5,
							builder: new Map(),
						},
					],
				]),
			},
		],
	});
});

test('Method command using two aliases with args', async () => {
	const { args, cmds } = await handler.command('!alias_test alias_test_2 someArgs -ddd someArg');
	expect({ args: args, cmds: cmds }).toEqual({
		args: { _: ['someargs'], ddd: 'somearg' },
		cmds: [
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test'],
				builder: new Map([
					[
						'test_2',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test_2'],
							delay: 5,
							builder: new Map([
								[
									'test_3',
									{
										usage: 'test',
										description: '5',
										aliases: ['alias_test'],
										delay: 5,
										builder: new Map(),
									},
								],
							]),
						},
					],
				]),
				delay: 5,
			},
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test_2'],
				delay: 5,
				builder: new Map([
					[
						'test_3',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test'],
							delay: 5,
							builder: new Map(),
						},
					],
				]),
			},
		],
	});
});
const handlerArray = CommandHandler(['./test/test_cmds', './test/test_cmds_another']);


test('Pass Dirs As Array', async () => {
	const { args, cmds } = await handlerArray.command('!alias_test alias_test_2 someArgs -ddd someArg');
	expect({ args: args, cmds: cmds }).toEqual({
		args: { _: ['someargs'], ddd: 'somearg' },
		cmds: [
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test'],
				builder: new Map([
					[
						'test_2',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test_2'],
							delay: 5,
							builder: new Map([
								[
									'test_3',
									{
										usage: 'test',
										description: '5',
										aliases: ['alias_test'],
										delay: 5,
										builder: new Map(),
									},
								],
							]),
						},
					],
				]),
				delay: 5,
			},
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test_2'],
				delay: 5,
				builder: new Map([
					[
						'test_3',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test'],
							delay: 5,
							builder: new Map(),
						},
					],
				]),
			},
		],
	});
});

test('Pass Dirs As Array Second Dir', async () => {
	const { args, cmds } = await handlerArray.command('!alias_test_another alias_test_2_another someArgs -ddd someArg');
	expect({ args: args, cmds: cmds }).toEqual({
		args: { _: ['someargs'], ddd: 'somearg' },
		cmds: [
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test_another'],
				builder: new Map([
					[
						'test_2_another',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test_2_another'],
							delay: 5,
							builder: new Map([
								[
									'test_3_another',
									{
										usage: 'test',
										description: '5',
										aliases: ['alias_test_another'],
										delay: 5,
										builder: new Map(),
									},
								],
							]),
						},
					],
				]),
				delay: 5,
			},
			{
				usage: 'test',
				description: '5',
				aliases: ['alias_test_2_another'],
				delay: 5,
				builder: new Map([
					[
						'test_3_another',
						{
							usage: 'test',
							description: '5',
							aliases: ['alias_test_another'],
							delay: 5,
							builder: new Map(),
						},
					],
				]),
			},
		],
	});
});


test('No alias test', async () => {
	const { args, cmds } = await handlerArray.command('!test_cmd_no_alias someArgs -ddd someArg');
	expect({ args: args, cmds: cmds }).toEqual({
		args: { _: ['someargs'], ddd: 'somearg' },
		cmds: [
			{
				usage: 'test',
				description: '5',
				builder: new Map([
					[
						'test_cmd_2',
						{
							usage: 'test',
							description: '5',
							builder: new Map(),
							delay: 5,
							
						}
					]
				]),
				delay: 5,
			}
		],
	});
});