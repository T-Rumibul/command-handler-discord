import CommandHandler from './index';
const handler = CommandHandler('./test');

test('Parse directory with commands', () => {
	expect(handler).toEqual([
		{
			name: 'test_cmd',
			usage: 'test',
			description: '5',
			aliases: ['alias_test'],
			delay: 5,
			builder: [
				{
					name: 'test_2',
					usage: 'test',
					description: '5',
					aliases: ['alias_test'],
					builder: [
						{
							name: 'test_3',
							usage: 'test',
							description: '5',
							aliases: ['alias_test'],
							delay: 5,
							builder: [],
						},
					],
					delay: 5,
				},
			],
		},
	]);
});
