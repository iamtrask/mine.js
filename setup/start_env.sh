#!/bin/sh

# start infra locally (seems more stable than docker)

ipfs daemon&

testrpc --db ./data/testrpc_persist --seed 20170812 --accounts 42 &