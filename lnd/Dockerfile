FROM ubuntu:18.04

RUN apt-get update && \
    apt-get upgrade -yq && \
    apt-get install vim wget curl gnupg gosu git telnet -yq && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV LND_VERSION=v0.13.0-beta 
ENV TARGETPLATFORM=linux-armv7

WORKDIR /opt
RUN wget https://github.com/lightningnetwork/lnd/releases/download/${LND_VERSION}/lnd-${TARGETPLATFORM}-${LND_VERSION}.tar.gz

# TODO: missing checksum

RUN tar -xzf *.tar.gz -C /opt

ENV PATH=/opt/lnd-${TARGETPLATFORM}-${LND_VERSION}:$PATH

#ENTRYPOINT ["tail", "-f", "/dev/null"]