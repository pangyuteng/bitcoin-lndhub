## bitcoin-lndhub (pi3 + docker-compose)

How to setup Bitcoin Lightning (bluewallet LndHub) with raspberrypi3 and docker-compose.

motivation:  most people use `getumbrel/umbrel` to set up a lightning node with a raspberry pi4, but what if you want to stack Sats so bad and you'd rather just stick with an used pi3? ** translation ** you are too cheap to buy a pi4 and a 1tb ssd, and you'd rather waste a whole afternoon creating your own docker solution, and when i say you, i really meant to say I.

+ spec: Raspberry3 (arm32v7, 1gb RAM), 32gb SD-card, 750GB HDD, raspbian OS.

### instructions

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
    + for example, modify `username` and `password` in `bitcoin.conf`. 


### reference
http://help.bluewallet.io/en/articles/2849035-lndhub-on-your-own-vps-with-ubuntu
http://help.bluewallet.io/en/articles/2849000-lndhub-with-raspibolt
https://github.com/ruimarinho/docker-bitcoin-core/blob/master/0.21/Dockerfile

