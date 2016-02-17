var storeExceptionCodes = module.exports = {
  // Store exception codes
  ST1: {
    code: 'ST1',
    message: 'Providers cannot be null and its length must be higher than 0.',
    operation: 'Instantiate Store',
    context: 'Store'
  },
  ST2: {
    code: 'ST2',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Get',
    context: 'Store'
  },
  ST3: {
    code: 'ST3',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Set',
    context: 'Store'
  },
  ST4: {
    code: 'ST4',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Del',
    context: 'Store'
  },
  ST5: {
    code: 'ST5',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Incr',
    context: 'Store'
  },
  ST6: {
    code: 'ST6',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Decr',
    context: 'Store'
  },
  ST7: {
    code: 'ST7',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Exists',
    context: 'Store'
  },
  ST8: {
    code: 'ST8',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Persist',
    context: 'Store'
  },
  ST9: {
    code: 'ST9',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Ttl',
    context: 'Store'
  },
  ST10: {
    code: 'ST10',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Expire',
    context: 'Store'
  },
  ST11: {
    code: 'ST11',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'ExpireAt',
    context: 'Store'
  },
  ST12: {
    code: 'ST12',
    message: 'Parameter cannot be null and must be an object.',
    operation: 'Keys',
    context: 'Store'
  },
  ST13: {
    code: 'ST13',
    message: 'Provider cannot be null and must be an object.',
    operation: 'Set provider',
    context: 'Store'
  },

  // Redis provider exception codes
  RST1: {
    code: 'RST1',
    message: 'Error connecting client.',
    operation: 'Connect Redis client',
    context: 'Redis Store'
  },
  RST2: {
    code: 'RST2',
    message: 'Error authenticating Redis client.',
    operation: 'Authenticate Redis client',
    context: 'Redis Store'
  },
  RST3: {
    code: 'RST3',
    message: 'Error setting Redis client database.',
    operation: 'Set Redis client database',
    context: 'Redis Store'
  },
  RST4: {
    code: 'RST4',
    message: 'Error getting value with HGETALL command.',
    operation: 'Redis KEYS',
    context: 'Redis Store'
  },
  RST5: {
    code: 'RST5',
    message: 'Error incrementing value.',
    operation: 'Redis INCR/INCRBY',
    context: 'Redis Store'
  },
  RST6: {
    code: 'RST6',
    message: 'Error decrementing value.',
    operation: 'Redis DECR/DECRBY',
    context: 'Redis Store'
  },
  RST7: {
    code: 'RST7',
    message: 'No client to destroy.',
    operation: 'End Redis client',
    context: 'Redis Store'
  },
  RST8: {
    code: 'RST8',
    message: 'Client previously ended.',
    operation: 'End Redis client',
    context: 'Redis Store'
  },
  RST9: {
    code: 'RST9',
    message: 'Error getting value with HGET command.',
    operation: 'Redis HGET',
    context: 'Redis Store'
  },
  RST10: {
    code: 'RST10',
    message: 'Error getting value with GET command.',
    operation: 'Redis GET',
    context: 'Redis Store'
  },
  RST11: {
    code: 'RST11',
    message: 'Error setting value with HSET command.',
    operation: 'Redis HSET',
    context: 'Redis Store'
  },
  RST12: {
    code: 'RST12',
    message: 'Error setting value with HMSET command.',
    operation: 'Redis HMSET',
    context: 'Redis Store'
  },
  RST13: {
    code: 'RST13',
    message: 'Error setting value with SET command.',
    operation: 'Redis SET',
    context: 'Redis Store'
  },
  RST14: {
    code: 'RST14',
    message: 'Error deleting value with DEL command.',
    operation: 'Redis DEL',
    context: 'Redis Store'
  },
  RST15: {
    code: 'RST15',
    message: 'Error checking if key exists with EXISTS command.',
    operation: 'Redis EXISTS',
    context: 'Redis Store'
  },
  RST16: {
    code: 'RST16',
    message: 'Error removing TTL of a key with PERSIST command.',
    operation: 'Redis PERSIST',
    context: 'Redis Store'
  },
  RST17: {
    code: 'RST17',
    message: 'Error getting expiration time with TTL command.',
    operation: 'Redis TTL',
    context: 'Redis Store'
  },
  RST18: {
    code: 'RST18',
    message: 'Error giving key an expiration time with EXPIRE command.',
    operation: 'Redis EXPIRE',
    context: 'Redis Store'
  },
  RST19: {
    code: 'RST19',
    message: 'Error giving key an expiration time with EXPIREAT command.',
    operation: 'Redis EXPIREAT',
    context: 'Redis Store'
  },
  RST20: {
    code: 'RST20',
    message: 'Error getting keys with KEYS command.',
    operation: 'Redis KEYS',
    context: 'Redis Store'
  },
  RST21: {
    code: 'RST21',
    message: 'Error deleting field with HDEL command.',
    operation: 'Redis HDEL',
    context: 'Redis Store'
  },
  RST22: {
    code: 'RST22',
    message: 'Error getting value with HGETALL command.',
    operation: 'Redis HGETALL',
    context: 'Redis Store'
  },

  // Memory provider exception codes
  MST1: {
    code: 'MST1',
    message: 'Value is not an object.',
    operation: 'Memory KEYS',
    context: 'Memory Store'
  },
  MST2: {
    code: 'MST2',
    message: 'Error incrementing value.',
    operation: 'Memory INCR/INCRBY',
    context: 'Memory Store'
  },
  MST3: {
    code: 'MST3',
    message: 'Error decrementing value.',
    operation: 'Memory DECR/DECRBY',
    context: 'Memory Store'
  },
  MST4: {
    code: 'MST4',
    message: 'No client to destroy.',
    operation: 'End Memory client',
    context: 'Memory Store'
  },
  MST5: {
    code: 'MST5',
    message: 'Error getting value with HGET command.',
    operation: 'Memory HGET',
    context: 'Memory Store'
  },
  MST6: {
    code: 'MST6',
    message: 'Error getting value with GET command.',
    operation: 'Memory GET',
    context: 'Memory Store'
  },
  MST7: {
    code: 'MST7',
    message: 'Exception getting value.',
    operation: 'Memory get',
    context: 'Memory Store'
  },
  MST8: {
    code: 'MST8',
    message: 'Error giving key an expiration time with EXPIRE command.',
    operation: 'Memory EXPIRE',
    context: 'Memory Store'
  },
  MST9: {
    code: 'MST9',
    message: 'Error giving key an expiration time with EXPIREAT command.',
    operation: 'Memory EXPIREAT',
    context: 'Memory Store'
  },
  MST10: {
    code: 'MST10',
    message: 'Error getting value with HGETALL command.',
    operation: 'Memory HGETALL',
    context: 'Memory Store'
  },

  // MySQL provider exception codes
  MSST1: {
    code: 'MSST1',
    message: 'Value is not an object.',
    operation: 'MySQL KEYS',
    context: 'MySQL Store'
  },
  MSST2: {
    code: 'MSST2',
    message: 'Error incrementing value.',
    operation: 'MySQL INCR/INCRBY',
    context: 'MySQL Store'
  },
  MSST3: {
    code: 'MSST3',
    message: 'Error decrementing value.',
    operation: 'MySQL DECR/DECRBY',
    context: 'MySQL Store'
  },
  MSST4: {
    code: 'MSST4',
    message: 'No client to destroy.',
    operation: 'End MySQL client',
    context: 'MySQL Store'
  },
  MSST5: {
    code: 'MSST5',
    message: 'Client previously ended.',
    operation: 'End MySQL client',
    context: 'MySQL Store'
  },
  MSST6: {
    code: 'MSST6',
    message: 'Error getting value.',
    operation: 'End MySQL client',
    context: 'MySQL Store'
  }
};
