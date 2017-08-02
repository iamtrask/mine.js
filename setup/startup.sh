#!/bin/sh

# define and settings
export ipfs_staging=$PWD/data/ipfs_staging
export ipfs_data=$PWD/data/ipfs_data

# start the IPFS daemon
docker run -d --name ipfs_host -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 8080:8080 -p 4001:4001 -p 5001:5001 ipfs/go-ipfs:latest

# start ethereum testrpc
docker run -d -p 8545:8545 ethereumjs/testrpc:latest -a 1000 --debug