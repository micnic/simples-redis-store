'use strict';

const { createClient } = require('redis');

/**
 * @typedef {import('redis').RedisClientType} RedisClientType
 */

const { parse, stringify } = JSON;

/**
 * @template T
 */
class RedisStore {

	/**
	 * Redis store constructor
	 * @param {RedisClientType} client
	 */
	constructor(client = createClient()) {

		// Add Redis client to the store
		/** @type {RedisClientType} */
		this.client = client;

		// Connect the Redis client
		client.connect();
	}

	/**
	 * Store get method implementation
	 * @param {string} id
	 * @returns {Promise<T | null>}
	 */
	async get(id) {

		const value = await this.client.get(id);

		// Check for not found value
		if (value === null) {
			return null;
		}

		return parse(value);
	}

	/**
	 * Store remove method implementation
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async remove(id) {

		// Send "del" command to the database
		await this.client.del(id);
	}

	/**
	 * Store set method implementation
	 * @param {string} id
	 * @param {T} data
	 * @param {number} timeout
	 * @returns {Promise<void>}
	 */
	async set(id, data, timeout) {

		// Send "set" command to the database
		await this.client.set(id, stringify(data), { PX: timeout });
	}

	/**
	 * Store update method implementation
	 * @param {string} id
	 * @param {number} timeout
	 * @returns {Promise<void>}
	 */
	async update(id, timeout) {

		// Send "pExpire" command to the database
		await this.client.pExpire(id, timeout);
	}
}

module.exports = RedisStore;