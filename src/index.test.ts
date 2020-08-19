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
		])
	);
});
test('Parse directory with commands', () => {
	console.log(handler.aliases.get('alias_test').builder.get('alias_test'));
	expect(
		handler.aliases.get('alias_test').builder.get('alias_test').builder.get('alias_test').name
	).toBe('test_3');
});
