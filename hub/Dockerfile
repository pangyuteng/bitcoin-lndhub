FROM ubuntu:18.04

RUN apt-get update && \
    apt-get upgrade -yq && \
    apt-get install vim wget curl gnupg gosu git telnet libatomic1 -yq  && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /opt
#ENV NODE_VERSION=v10.15.3
#ENV TARGETPLATFORM=linux-armv7l
#RUN wget https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-${TARGETPLATFORM}.tar.xz && \
#    mkdir -p /usr/local/lib/nodejs/node-${NODE_VERSION} && \
#    tar -xf node-${NODE_VERSION}-${TARGETPLATFORM}.tar.xz -C /usr/local/lib/nodejs/node-${NODE_VERSION}
# TODO: missing checksum
#
#RUN ln -s /usr/local/lib/nodejs/node-${NODE_VERSION}/node-${NODE_VERSION}-${TARGETPLATFORM}/bin/node /usr/local/bin/node && \
#    ln -s /usr/local/lib/nodejs/node-${NODE_VERSION}/node-${NODE_VERSION}-${TARGETPLATFORM}/bin/npm /usr/local/bin/npm

#alt have not tried. https://github.com/nodesource/distributions
#curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
#sudo apt-get install -y nodejs

RUN git clone https://github.com/audstanley/NodeJs-Raspberry-Pi.git nodejsrpi
WORKDIR /opt/nodejsrpi
RUN /bin/bash Install-Node.sh -v 12;


WORKDIR /opt
ENV LNDHUB_VERSION=v1.3.5
RUN git clone https://github.com/BlueWallet/LndHub
WORKDIR /opt/LndHub
RUN git checkout ${LNDHUB_VERSION}

ENV PATH=/opt/local/bin:$PATH
RUN npm install && \
    npm install --save-dev @babel/core @babel/cli @babel/preset-env
RUN ln -s /opt/LndHub/node_modules/.bin/babel /usr/local/bin/babel

RUN mkdir -p /opt/LndHub/build && \
    babel ./ --out-dir ./build --copy-files --ignore node_modules

#ENTRYPOINT ["tail", "-f", "/dev/null"]
