#!/usr/bin/env node
const program = require('commander')
const app = require('./app.js')

program
	.version('0.0.1')
	.usage('[options]')
  .option('-m, --mine-address <address>', 'Blockchain address for the mine to use')
  .option('-c, --contract-address <address>', 'Sonar smart contract address for the mine to use')
  .option('-i, --ipfs-url [url]', 'Url of the IPFS node')
  .option('-e, --ethereum-url [url]', 'Url to the ethereum network to use')
	.parse(process.argv)

const mineAddress = program.mineAddress
const contractAddress = program.contractAddress
const ipfsUrl = program.args.ipfsUrl || {host: 'localhost', port: '5001', protocol: 'http'}
app.checkForModels(mineAddress, contractAddress, program.args.ethereumUrl, ipfsUrl)
