## run a Lightning Node with Pi 3 and Docker

How to setup BlueWallet's Lightning Hub with a Raspberry Pi 3 and Docker.

This repo documents my journey of setting up BlueWallet's Lightning Hub using a Pi3 (linux/arm/v7) and Docker.  Most people use Pi4 (arm64) and have no issues with just using the OS provided by Umbrel, however I had a Pi3 lying around running bitcoind, so I thought why not put it into a even better use - full bitcoin node + lightning node and link it up to a bluewallet?

my hardware spec: Raspberry Pi 3 Model B (arm32v7, 1gb RAM), 32gb SD-card, 750GB HDD, raspbian OS.

### instructions

+ find a Raspberry Pi3, 32GB sd card, 750+GB HDD/SSD

+ install Raspbian OS

+ install Docker and docker-compose

+ install Tor

```
https://opensource.com/article/20/4/tor-proxy-raspberry-pi
https://blog.lopp.net/tor-only-bitcoin-lightning-guide

```

+ make folders for storage, create config files using sample configs

```
export MYROOT=/mnt/hdd
mkdir -p $MYROOT/redis
mkdir -p $MYROOT/bitcoin
mkdir -p $MYROOT/lnd
mkdir -p $MYROOT/hub

cp bitcoind/bitcoin.conf $MYROOT/bitcoind/bitcoin.conf
cp lnd/lnd.conf $MYROOT/lnd/lnd.conf
cp lnd/config.js $MYROOT/hub/config.js

```
    + modify config, i.e. `username` and `password` in `bitcoin.conf`. 

    + accordingly modify config based on  `https://blog.lopp.net/tor-only-bitcoin-lightning-guide` so you can use Tor.

+ initial setup

```
docker-compose up -d bitcoind
# disable `wallet-unlock-password-file` in `lnd.conf`
docker-compose up -d lnd
docker exec -it btc_lnd_1 bash
lncli create
exit
# enable `wallet-unlock-password-file` in `lnd.conf`
docker-compose restart lnd
docker-compose up -d hub
```

+ run below

```
docker-compose up -d
```



### reference
http://help.bluewallet.io/en/articles/2849035-lndhub-on-your-own-vps-with-ubuntu
http://help.bluewallet.io/en/articles/2849000-lndhub-with-raspibolt
https://github.com/getumbrel/umbrel/blob/master/apps/bluewallet/docker-compose.yml
https://github.com/ruimarinho/docker-bitcoin-core/blob/master/0.21/Dockerfile
https://stadicus.github.io/RaspiBolt/raspibolt_72_zap-ios.html
https://www.expressvpn.com/internet-privacy/how-to-set-up-a-home-server-and-use-it-as-a-bitcoin-node
https://stadicus.github.io/RaspiBolt/raspibolt_70_troubleshooting.html
https://github.com/lightningnetwork/lnd/issues/4422
https://bitcoin.stackexchange.com/questions/91802/are-official-bitcoin-core-released-compiled-with-zmq-in-general

### misc

+ testing zeromq port access...
```
telnet localhost 28332
curl --user username:password -H 'content-type:text/plain;' http://localhost:28332 --data-binary '{"jsonrpc":"1.0","id":"1","method":"getmininginfo"}' --output out.binary

export LND_DIR=/mnt/hdd/lnd
export MACAROON_HEADER="Grpc-Metadata-macaroon: $(sudo xxd -ps -u -c 1000 $LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon)"
curl -X GET --cacert $LND_DIR/tls.cert --header "$MACAROON_HEADER" https://localhost:8080/v1/balance/blockchain

```
