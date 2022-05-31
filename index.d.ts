import type { RedisClientType } from 'redis';

declare class RedisStore<T> {

	/**
	 * Redis client
	 */
	client: RedisClientType;

	/**
	 * Simples Redis Storec constructor
	 */
	constructor(client?: RedisClientType);

	/**
	 * Store data from the store
	 */
	get(id: string): Promise<T | null>;

	/**
	 * Remove data from the store
	 */
	remove(id: string): Promise<void>;

	/**
	 * Save data to the store
	 */
	set(id: string, value: T, timeout: number): Promise<void>;

	/**
	 * Update expiration time of the data in the store
	 */
	update(id: string, timeout: number): Promise<void>;
}

export = RedisStore;