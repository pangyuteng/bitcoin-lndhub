## run a Lightning Node with Pi 3 and Docker

How to setup BlueWallet's Lightning Hub with a Raspberry Pi 3 and Docker.

This repo documents my journey of setting up BlueWallet's Lightning Hub using a Pi3 (linux/arm/v7) and Docker.  Most people use Pi4 (arm64) and have no issues with just using the OS provided by Umbrel, however I had a Pi3 lying around running bitcoind, so I thought why not put it into a even better use - full bitcoin node + lightning node and link it up to a bluewallet?

my hardware spec: Raspberry Pi 3 Model B (arm32v7, 1gb RAM), 32gb SD-card, 750GB HDD.

### instructions

+ find a Raspberry Pi3, 64GB sd card, 750+GB HDD/SSD

+ install Raspbian OS or Ubuntu Core

	+ I installed Ubuntu 20.04.3 LTS (GNU/Linux 5.4.0-1043-raspi armv7l)

+ install basic tools (some may already been installed...)

```
sudo apt-get update
sudo apt-get install network-manager curl wget vim git -yq
```

+ enable swap, i added a 4GB swap file, not sure what the optimal size is **** super important to add swap! ****

```
https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-20-04
```

+ install Docker and docker-compose (better way is via docker official site)

```
sudo apt install -y docker.io docker-compose
```


+ install Tor

```
https://opensource.com/article/20/4/tor-proxy-raspberry-pi

# using below update config `sudo vim /etc/tor/torrc`
https://wiki.ion.radar.tech/tutorials/nodes/tor

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
cp SAMPLE.env .env
```
    + modify config, i.e. `[redacted]` in `bitcoin.conf`, `lnd.conf` and `.env`.

    + accordingly modify config based on  `https://blog.lopp.net/tor-only-bitcoin-lightning-guide` so you can use Tor.

+ initial setup (kinda twisted here, because you have to create a lnd wallet first)

```
docker-compose up -d bitcoind
# disable `wallet-unlock-password-file` in `lnd.conf`, i.e. adding char `#` infront of password line
docker-compose up -d lnd
docker exec -it btc_lnd_1 bash
lncli create
exit
# enable `wallet-unlock-password-file` in `lnd.conf`, i.e. removing char `#` infront of password line
docker-compose restart lnd
docker-compose up -d hub
```

+ run below

```
docker-compose up -d core redis lnd
```


+ `lnd` is going to be erroring out, until `core` syncs up.
+ `lnd`/zeromq  may also have issue allocating memory.
+ cross your finger, or figure out a way to reduce memory, so lnd can run.

```
docker-compose up -d hub
```

+ then `hub` will be able to connect to `lnd`.




+ to stop the service run below first, and wait until core logs: `Shutdown: done`

```
docker exec -it btc_core_1 bash
bitcoin-cli stop


docker-compose down

```




### reference
```
http://help.bluewallet.io/en/articles/2849035-lndhub-on-your-own-vps-with-ubuntu

http://help.bluewallet.io/en/articles/2849000-lndhub-with-raspibolt

https://github.com/getumbrel/umbrel/blob/master/apps/bluewallet/docker-compose.yml

https://github.com/ruimarinho/docker-bitcoin-core/blob/master/0.21/Dockerfile

https://stadicus.github.io/RaspiBolt/raspibolt_72_zap-ios.html

https://www.expressvpn.com/internet-privacy/how-to-set-up-a-home-server-and-use-it-as-a-bitcoin-node

https://stadicus.github.io/RaspiBolt/raspibolt_70_troubleshooting.html

https://github.com/lightningnetwork/lnd/issues/4422

https://bitcoin.stackexchange.com/questions/91802/are-official-bitcoin-core-released-compiled-with-zmq-in-general
```

### misc

+ testing zeromq port access...
```
telnet localhost 28332
export rpcuser=
export rpcpass=
curl --user ${rpcuser}:${rpcpass} -H 'content-type:text/plain;' --data-binary '{"jsonrpc":"1.0","id":"1","method":"getmininginfo"}' http://localhost:8332

{"result":{"blocks":699454,"difficulty":17615033039278.88,"networkhashps":1.547233619238887e+20,"pooledtx":0,"chain":"main","warnings":""},"error":nul
l,"id":"1"}


## above indicates bitoin-core is running
--

export LND_DIR=/mnt/hdd/lnd
export MACAROON_HEADER="Grpc-Metadata-macaroon: $(sudo xxd -ps -u -c 1000 $LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon)"
curl -X GET --cacert $LND_DIR/tls.cert --header "$MACAROON_HEADER" https://localhost:8080/v1/balance/blockchain

# initial responses:

{"error":"the RPC server is in the process of starting up, but not yet ready to accept calls","code":2,"message":"the RPC server is in the process of starting up, but not yet ready to accept calls","details":[]}

# once blockchain is almost synced, response will turn into below:

{"total_balance":"0","confirmed_balance":"0","unconfirmed_balance":"0","account_balance":{"default":{"confirmed_balance":"0","unconfirmed_balance":"0"}}}


## above indicates lightning is running
--


docker exec -it btc_hub_1 bash
node build/index.js

^^ above errored out

`docker logs  btc_lnd_1 -f` showed below

2021-09-25 05:58:16.066 [ERR] RPCS: [/lnrpc.Lightning/GetInfo]: encoding/hex: invalid byte: U+002F '/'




```
