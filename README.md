## LndHub with Docker! (via pi3 + docker-compose)

How to setup BlueWallet's Lightning Hub with a "Raspberry Pi 3 Model B" and docker-compose.

Motivation: tl.dr. I am attemping to build a Lightning Hub solution for Pi 3 (linux/arm/v7).
long story: Most people use `getumbrel/umbrel` to set up a lightning node with a raspberry pi4, but what if you want to stack Sats so bad and you'd rather just stick with an used pi3? ** translation ** you are too cheap to buy a pi4 and a 1tb ssd, and you'd rather waste a whole afternoon recreating pretty much the same docker solution as umbrel, and when i say you, i really meant to say I. 

+ spec: Raspberry3 (arm32v7, 1gb RAM), 32gb SD-card, 750GB HDD, raspbian OS.

### instructions

+ acquire a Raspberry Pi3, 32GB sd card, 750+GB HDD/SSD.

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
docker-compose up
ctrl-c
sudo chmod 777 /mnt/hdd/lnd/data/chain/bitcoin/mainnet/admin.macaroon
docker-compose up -d
```



### reference
http://help.bluewallet.io/en/articles/2849035-lndhub-on-your-own-vps-with-ubuntu
http://help.bluewallet.io/en/articles/2849000-lndhub-with-raspibolt
https://github.com/getumbrel/umbrel/blob/master/apps/bluewallet/docker-compose.yml
https://github.com/ruimarinho/docker-bitcoin-core/blob/master/0.21/Dockerfile

