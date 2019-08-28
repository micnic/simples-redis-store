'use strict';

const { createClient } = require('redis');

const { parse, stringify } = JSON;

const delCommand = 'del';
const getCommand = 'get';
const pexpireArgument = 'px';
const pexpireCommand = 'pexpire';
const setCommand = 'set';

class RedisStore {

	/**
	 * Redis store constructor
	 * @param {RedisClient} client
	 */
	constructor(client = createClient()) {
		this.client = client;
	}

	/**
	 * Store get method implementation
	 * @param {string} id
	 * @returns {Promise<*>}
	 */
	get(id) {

		return new Promise((resolve, reject) => {

			// Send "get" command to the database
			this.client.sendCommand(getCommand, [id], (error, data) => {
				if (error) {
					reject(error);
				} else {
					try {
						resolve(parse(data));
					} catch (exception) {
						reject(exception);
					}
				}
			});
		});
	}

	/**
	 * Store remove method implementation
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	remove(id) {

		return new Promise((resolve, reject) => {

			// Send "del" command to the database
			this.client.sendCommand(delCommand, [id], (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	/**
	 * Store set method implementation
	 * @param {string} id
	 * @param {Session} session
	 * @param {number} timeout
	 * @returns {Promise<void>}
	 */
	set(id, session, timeout) {

		return new Promise((resolve, reject) => {

			// Catch any error on session stringify
			try {

				// Send "set" command to the database with timeout parameter
				this.client.sendCommand(setCommand, [
					id,
					stringify(session),
					pexpireArgument,
					timeout
				], (error) => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Store update method implementation
	 * @param {string} id
	 * @param {number} timeout
	 * @returns {Promise<void>}
	 */
	update(id, timeout) {

		return new Promise((resolve, reject) => {

			// Send "pexpire" command to the database
			this.client.sendCommand(pexpireCommand, [id, timeout], (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}
}

module.exports = RedisStore;