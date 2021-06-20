FROM ubuntu:18.04

RUN apt-get update && \
    apt-get upgrade -yq && \
    apt-get install vim wget curl gnupg gosu git telnet -yq && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV TARGETPLATFORM=arm-linux-gnueabihf
ENV BITCOIN_VERSION=0.21.1
ENV PATH=/opt/bitcoin-${BITCOIN_VERSION}/bin:$PATH
ENV BITCOIN_DATA=/home/bitcoin/.bitcoin

WORKDIR /opt
RUN wget https://bitcoincore.org/bin/bitcoin-core-${BITCOIN_VERSION}/SHA256SUMS.asc && \
  wget https://bitcoincore.org/bin/bitcoin-core-${BITCOIN_VERSION}/bitcoin-${BITCOIN_VERSION}-${TARGETPLATFORM}.tar.gz

# checksum
RUN gpg --keyserver hkp://keyserver.ubuntu.com --recv-keys 01EA5486DE18A882D4C2684590C8019E36C2E964 && \
    gpg --verify SHA256SUMS.asc && grep " bitcoin-${BITCOIN_VERSION}-${TARGETPLATFORM}.tar.gz" SHA256SUMS.asc | sha256sum -c

RUN tar -xzf *.tar.gz -C /opt \
   && rm *.tar.gz *.asc \
   && rm -rf /opt/bitcoin-${BITCOIN_VERSION}/bin/bitcoin-qt

RUN bitcoind -version | grep "Bitcoin Core version v${BITCOIN_VERSION}"

#ENTRYPOINT ["tail", "-f", "/dev/null"]