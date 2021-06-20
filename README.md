## run a Lightning Node with Pi 3 and Docker

How to setup BlueWallet's Lightning Hub with a Raspberry Pi 3 and Docker.

This repo documents my journey of setting up BlueWallet's Lightning Hub using a Pi3 (linux/arm/v7) and Docker.  Most people use Pi4 (arm64) and have no issues with just using the OS provided by Umbrel, however I had a Pi3 lying around running bitcoind, so I thought why not put it into a even better use - full bitcoin node + lightning node and link it up to a bluewallet?

my hardware spec: Raspberry Pi 3 Model B (arm32v7, 1gb RAM), 32gb SD-card, 750GB HDD, raspbian OS.

### instructions

+ find a Raspberry Pi3, 32GB sd card, 750+GB HDD/SSD

+ install Raspbian OS

+ install Docker and docker-compose

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
    +  modify config, i.e. `username` and `password` in `bitcoin.conf`. 


+ run below

```
docker-compose up -d
```



### reference
http://help.bluewallet.io/en/articles/2849035-lndhub-on-your-own-vps-with-ubuntu
http://help.bluewallet.io/en/articles/2849000-lndhub-with-raspibolt
https://github.com/getumbrel/umbrel/blob/master/apps/bluewallet/docker-compose.yml
https://github.com/ruimarinho/docker-bitcoin-core/blob/master/0.21/Dockerfile

