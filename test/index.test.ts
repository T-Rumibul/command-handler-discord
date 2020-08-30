import CommandHandler from '../src/';
const handler = CommandHandler('./test/test_cmds');

test('Parse directory with commands', () => {
	expect(handler.commands).toEqual(
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
		])
	);
});
test('Parse aliases', () => {
	expect(
		handler.aliases.get('alias_test').builder.get('alias_test_2').builder.get('alias_test').name
	).toBe('test_3');
});

test('Method command', () => {
	const { args, cmds } = handler.command('!test_cmd test_2');

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

test('Method command using alias', () => {
	const { args, cmds } = handler.command('!alias_test test_2');
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

test('Method command using two aliases', () => {
	const { args, cmds } = handler.command('!alias_test alias_test_2');
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

test('Method command using two aliases with args', () => {
	const { args, cmds } = handler.command('!alias_test alias_test_2 someArgs -ddd someArg');
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
