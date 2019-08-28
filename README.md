[0]: https://www.npmjs.com/package/simples

# simples-redis-store 0.9.0

`simples-redis-store` is a session store for `simples` that is using `redis`
database, it is designed to work with simples starting version 0.9.0.

## Install

```
npm i simples-redis-store
```

Or install the package together with [simples][0]:

```
npm i simples simples-redis-store
```

## Usage
Basic usage consists in creating a new redis store and providing it to the
server configuration.

```js
const simples = require('simples');
const RedisStore = require('simples-redis-store');

const server = simples();
const store = new RedisStore();

server.session({
    enabled: true,
    store
});
```

In case a client to the database is already created it can be used as a
parameter to the redis store constructor like in the following example:

```js
const redis = require('redis');
const simples = require('simples');
const RedisStore = require('simples-redis-store');

const client = redis.createClient(/* Redis client configuration */);
const server = simples();
const store = new RedisStore(client);

server.session({
    enabled: true,
    store
});
```

The `redis` client is always available as a property of the store to be able to.