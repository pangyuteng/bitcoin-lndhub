FROM ubuntu:18.04

RUN apt-get update && \
    apt-get upgrade -yq && \
    apt-get install vim wget curl gnupg gosu git -yq && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /opt
ENV NODE_VERSION=v10.15.3
RUN wget https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-armv7l.tar.xz && \
    mkdir -p /usr/local/lib/nodejs/node-${NODE_VERSION} && \
    tar -xf node-${NODE_VERSION}-linux-armv7l.tar.xz -C /usr/local/lib/nodejs/node-${NODE_VERSION}
# TODO: missing checksum

RUN ln -s /usr/local/lib/nodejs/node-${NODE_VERSION}/node-${NODE_VERSION}-linux-armv7l/bin/node /usr/local/bin/node && \
    ln -s /usr/local/lib/nodejs/node-${NODE_VERSION}/node-${NODE_VERSION}-linux-armv7l/bin/npm /usr/local/bin/npm

ENV HUB_VERSION=master
RUN git clone https://github.com/BlueWallet/LndHub
WORKDIR /opt/LndHub
RUN git checkout ${HUB_VERSION}

ENV PATH=/opt/local/bin:$PATH
RUN npm install && \
    npm install --save-dev @babel/core @babel/cli @babel/preset-env
RUN ln -s /opt/LndHub/node_modules/.bin/babel /usr/local/bin/babel

RUN mkdir -p /opt/LndHub/build && \
    babel ./ --out-dir ./build --copy-files --ignore node_modules
