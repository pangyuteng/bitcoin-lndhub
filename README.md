## bitcoin-lndhub

How to setup raspberrypi3 and docker-compose to setup bitcoin-core node and lightning (bluewallet LndHub).

motivation:  most people use getumbrel/umbrel to set up a lightning node with a raspberry pi4, but i really just want to stick with my pi3 and wanted to explorer bluewallets LndHub.

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

