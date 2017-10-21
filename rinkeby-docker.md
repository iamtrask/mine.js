# Run local rinkeby node in docker

## Local directory

To make sure you persistently set up your address we will mount a local directory into the docker container. Otherwise you might have to redo the setup.

```sh
mkdir .geth
```

## Start geth

Start the container with the local directory mounted

```sh
docker run -v "$PWD/.geth:/root/.ethereum" ethereum/client-go --rinkeby
```

This will create the folder structure in your local directory. After it is started just kill it again hitting `ctrl+c`.

## Create your own ether rinkeby address

Head over to [myetherwallet](https://www.myetherwallet.com/#generate-wallet) and create a new wallet. Remember the password and download the _Keystore File_.

## Make the docker container load your account

To make sure `geth` knows your account and its private key we move the _Keyfile_ to the shared folder.

```sh
mv ~/Downloads/UTC--201* .geth/rinkeby/keystore/
```

We also need to pass the passphrase to unlock your account to the docker container. **DO NOT DO THIS ON MAIN NET**

```sh
echo "mypassphrase" > .geth/rinkeby/password.txt
```

## Run geth in docker

This is what you need to do from now on to run your local ethereum rinkeby node

_Make sure you change the `--unlock` address to yours
```sh
docker run -p 8545:8545 -p 30303:30303 -v "$PWD/.geth:/root/.ethereum" ethereum/client-go --rinkeby --rpc --rpcaddr 0.0.0.0 --rpcapi db,eth,net,web3,personal --unlock="d1ed944d70f57f892a7763b53a0a2a5fe4065312" --password /root/.ethereum/rinkeby/password.txt
```

**Current issue: Seems like the `geth` inside the docker container does not get the transactions from the test chain?**
