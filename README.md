
#### UPDATE 2024-01-18

+ setup test-core service to sync testnet

https://bitcoin.stackexchange.com/a/102077/105042
https://bitcoin.stackexchange.com/a/78604/105042

#### UPDATE 2022-12-29

bitcoin-core ver switched for PI4(ARM 64bit) in `bitcoind/Dockerfile`

#### UPDATE 2021-12-07

+ channel.db size exceeds 1GB, despite not having any channels open, resulting lnd erroring out.
```
https://github.com/lightningnetwork/lnd/issues/4811
``` 

#### UPDATE 2021-11-25

# *** DO NOT ATTEMPT RUNNING Lightning on 32-bit OS! Below is my attempt, you will likely loose your funds once channel.db exceeds 1GB! ***

+ channel.db size exceeded 2GB, which 32-bit compiled code will not be able to handle!
```
https://github.com/lightningnetwork/lnd/issues/5877
https://github.com/lightningnetwork/lnd/issues/5945
```

+ move `channel.db` from 32bit pc to 64bit pc, used chaintool to compact `channel.db`
```
#in 64-bit machine:
./chantools compactdb --sourcedb $SOMEWHERE/channel.db --destdb $ELSEWHERE/channel.db

#move new `channel.db` back in 32-bit lnd machine, and restart lnd.
docker-compose up -d --force-recreate lnd
```

+ lnd was started and stopped multiple times
    
  + files in `lnd` folder was replaced by error due to user error, below issues helped.

  + also, bump the fee up to force close the channels likely also helped.
```
https://github.com/lightningnetwork/lnd/issues/5347
https://github.com/lightningnetwork/lnd/issues/4771

lncli pendingchannels
```



#### UPDATE 2021-10-19

+ docker service is up for 7 days, RAM used 626MB of 856MB, swap used 416MB of 4GB, cpu capacity varies around 3-20%, temp is around 45C.

#### UPDATE 2021-10-12

+ *** ultimately you will still run into memory issues with raspberry pi 3 (see link/issue below) ***
```
  https://github.com/lightningnetwork/lnd/issues/4811
```



## run a Lightning Node with Pi 3 and Docker

How to setup BlueWallet's Lightning Hub with a Raspberry Pi 3 and Docker.

This repo documents my journey of setting up BlueWallet's Lightning Hub using a Pi3 (linux/arm/v7) and Docker.  Most people use Pi4 (arm64) and have no issues with just using the OS provided by Umbrel, however I had a Pi3 lying around running bitcoind, so I thought why not put it into a even better use - full bitcoin node + lightning node and link it up to a bluewallet?

my hardware spec: Raspberry Pi 3 Model B (arm32v7, 1gb RAM), 32gb SD-card, 750GB HDD.

## setup bitcoin-core,lnd,lndhub

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
https://askubuntu.com/questions/33697/how-do-i-add-swap-after-system-installation
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


+ enable port 3000
```
sudo ufw allow 3000 comment 'allow LndHub'
sudo ufw reload
```

+ all done now, check $IP:3000 in browser ! 

+ to stop the service run below first, and wait until core logs: `Shutdown: done`

```
docker exec -it btc_core_1 bash
bitcoin-cli stop
```
```
docker exec -it btc_lnd_1 bash
lncli stop
```
```
docker-compose down
```

+ note... ran in to memory allocation error, had to clear /mnt/lnd folder down to lnd.conf and pwd file.
and restart lnd.


## create lnd wallet and add channel

```
download lndconnect
https://github.com/LN-Zap/lndconnect/releases

read below
https://stopanddecrypt.medium.com/running-bitcoin-lightning-nodes-over-the-tor-network-2021-edition-489180297d5
https://github.com/lightningnetwork/lnd/blob/master/docs/configuring_tor.md

```

+ create wallet, save address
```
docker exec -it btc_lnd_1 bash
lncli newaddress np2wkh

```

+ sent 1usd to above address from muun lnd wallet, check balance to confirm receipt:
```
    lncli walletbalance
```

+ "expose" port 10009 via tor. added below to tor config and restart tor
```
sudo vim /etc/tor/torrc
```

```
CookieAuthFileGroupReadable 1
HiddenServiceDir /var/lib/tor/lnd/
HiddenServicePort 10009 127.0.0.1:10009
```
```
sudo systemctl restart tor
```
+ gracefully shutdown and up `lnd`.

+ create qr code for lnd wallet, to monitor via Zap.

```

cd lndconnect-linux-armv7-v0.2.0
export ONIONIP=$(sudo cat /var/lib/tor/lnd/hostname)
sudo ./lndconnect --lnddir=/mnt/hdd/lnd --host=$ONIONIP --port=10009 --image

scp lndconnect-qr.png .


````

+ use lnd wallet in Zap via qr code generated above.
```
https://stadicus.github.io/RaspiBolt/raspibolt_72_zap-ios.html
https://github.com/LN-Zap/zap-android/issues/185
```

+ move more sats to 40k+ sat?

+ create channel by first finding one on 1ml.com, then with `lncli connect` and `lncli openchannel` (run commands inside the running lnd container, you can probably also add via Zap app)

```
https://stopanddecrypt.medium.com/running-bitcoin-lightning-nodes-over-the-tor-network-2021-edition-489180297d5

sample commands:

lncli connect 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@of7husrflx7sforh3fw6yqlpwstee3wg5imvvmkp4bz6rbjxtg5nljad.onion:9735

lncli openchannel --node_key=03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f --local_amt=10000



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
