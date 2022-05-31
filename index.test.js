'use strict';

const { equal, ok, test, teardown } = require('tap');
const RedisStore = require('simples-redis-store');

const timeout = 1000;

const store = new RedisStore();

test('Basic store usage', async () => {
	await store.set('key', 'value', timeout);

	equal(await store.get('key'), 'value');

	await store.update('key', -1);

	equal(await store.get('key'), null);

	await store.set('key', 'value', timeout);
	await store.remove('key');
	await store.update('key', timeout);

	equal(await store.get('key'), null);
});

test('Invalid parameters for "get" method', async () => {
	try {
		// @ts-expect-error
		await store.get([]);
	} catch (error) {
		ok(error instanceof Error);
	}
});

test('Invalid stored value', async ({ end }) => {
	await store.client.set('key', 'value');

	try {
		await store.get('key');
	} catch (error) {
		ok(error instanceof Error);
		await store.remove('key');
		end();
	}
});

test('Invalid parameters for "remove" method', async () => {
	try {
		// @ts-expect-error
		await store.remove([]);
	} catch (error) {
		ok(error instanceof Error);
	}
});

test('Invalid parameters for "set" method', async () => {
	try {
		// @ts-expect-error
		await store.set(() => null, 'value', 0);
	} catch (error) {
		ok(error instanceof Error);
	}
});

test('Invalid value to store', async () => {

	const value = {};

	value.value = value;

	try {
		await store.set('key', value, 0);
	} catch (error) {
		ok(error instanceof Error);
	}
});

test('Invalid parameters for "update" method', async () => {
	try {
		// @ts-expect-error
		await store.update('key', 'value');
	} catch (error) {
		ok(error instanceof Error);
	}
});

teardown(() => {
	store.client.quit();
});