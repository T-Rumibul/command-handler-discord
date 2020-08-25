import CommandHandler from './index';
const handler = CommandHandler('./test');

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
								aliases: ['alias_test'],
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
	console.log(handler.aliases);
	expect(
		handler.aliases.get('alias_test').builder.get('alias_test').builder.get('alias_test').name
	).toBe('test_3');
});
