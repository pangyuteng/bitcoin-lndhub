let config = {
  bitcoind: {
    rpc: 'http://username:password@bitcoind:8332',
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
// above can be {} since `config` is below overides it.
if (process.env.CONFIG) {
  console.log('using config from env');
  config = JSON.parse(process.env.CONFIG);
}

module.exports = config;
