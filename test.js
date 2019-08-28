const tap = require('tap');

const RedisStore = require('simples-redis-store');

tap.test('Store without client provided', (test) => {

	const store = new RedisStore();

	test.test('Basic store usage', async (t) => {
		await store.set('key', 'value', 1000);

		t.equal(await store.get('key'), 'value');

		await store.update('key', -1);

		t.equal(await store.get('key'), null);

		await store.set('key', 'value', 1000);
		await store.remove('key');
		await store.update('key', 1000);

		t.equal(await store.get('key'), null);
	});

	test.test('Invalid parameters for "get" method', async (t) => {
		try {
			await store.get([]);
		} catch (error) {
			t.ok(error instanceof Error);
		}
	});

	test.test('Invalid stored value', (t) => {
		store.client.sendCommand('set', ['key', 'value'], (error) => {
			if (error) {
				throw error;
			} else {
				(async () => {
					try {
						await store.get('key');
					} catch (error) {
						t.ok(error instanceof Error);
						await store.remove('key');
						t.end();
					}
				})();
			}
		});
	});

	test.test('Invalid parameters for "remove" method', async (t) => {
		try {
			await store.remove([]);
		} catch (error) {
			t.ok(error instanceof Error);
		}
	});

	test.test('Invalid parameters for "set" method', async (t) => {
		try {
			await store.set(() => {}, 'value', 0);
		} catch (error) {
			t.ok(error instanceof Error);
		}
	});

	test.test('Invalid value to store', async (t) => {

		const value = {};

		value.value = value;

		try {
			await store.set('key', value, 0);
		} catch (error) {
			t.ok(error instanceof Error);
		}
	});

	test.test('Invalid parameters for "update" method', async (t) => {
		try {
			await store.update('key', 'value');
		} catch (error) {
			t.ok(error instanceof Error);
		}
	});

	test.tearDown(() => {
		store.client.quit();
	});

	test.end();
});