let config = {
  bitcoind: {
    rpc: 'http://user:password@bitcoind:8332',
  },
  redis: {
    port: 6379,
    host: 'redis',
    family: 4,
    db: 0,
  },
  lnd: {
    url: 'lnd:10009',
  },
};

if (process.env.CONFIG) {
  console.log('using config from env');
  config = JSON.parse(process.env.CONFIG);
}

module.exports = config;