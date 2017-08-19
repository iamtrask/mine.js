#!/usr/bin/env node
const program = require('commander')
const app = require('../lib/mine.js')
const assert = require('assert')

program
  .version('0.0.1')
  .usage('[options]')
  .option('-m, --mine-address <address>', 'Blockchain address for the mine to use')
  .option('-c, --contract-address <address>', 'Sonar smart contract address for the mine to use')
  .option('-i, --ipfs-url [url]', 'Url of the IPFS node (Default: "{host: \'localhost\', port: \'5001\', protocol: \'http\'})")')
  .option('-e, --ethereum-url [url]', 'Url to the ethereum network to use (Default: "http://localhost:8545")')
  // TODO: Add dev mode
  .parse(process.argv)

assert(program.mineAddress, '--mine-address required')
assert(program.contractAddress, '--contract-address required')
app.checkForModels(program.mineAddress, program.contractAddress, program.ethereumUrl, program.ipfsUrl)
