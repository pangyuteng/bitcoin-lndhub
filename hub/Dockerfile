FROM ubuntu:18.04

RUN apt-get update && \
    apt-get upgrade -yq && \
    apt-get install vim wget curl gnupg gosu git -yq && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV VERSION=master
WORKDIR /opt

RUN wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-armv7l.tar.xz && \
    mkdir -p /usr/local/lib/nodejs/node-v10.15.1 && \
    tar -xf node-v10.15.1-linux-armv7l.tar.xz -C /usr/local/lib/nodejs/node-v10.15.1

RUN ln -s /usr/local/lib/nodejs/node-v10.15.1/node-v10.15.1-linux-armv7l/bin/node /usr/local/bin/node && \
    ln -s /usr/local/lib/nodejs/node-v10.15.1/node-v10.15.1-linux-armv7l/bin/npm /usr/local/bin/npm

RUN git clone https://github.com/BlueWallet/LndHub
WORKDIR /opt/LndHub
RUN git checkout $VERSION

ENV PATH=/opt/local/bin:$PATH
RUN npm install
RUN npm install -g babel-cli
RUN mkdir build
RUN babel ./ --out-dir ./build --copy-files --ignore node_modules
