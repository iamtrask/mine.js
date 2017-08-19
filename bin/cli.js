#!/usr/bin/env node
const program = require('commander')
const app = require('../lib/mine.js')
const assert = require('assert')
const pckg = require('../package.json')

program
  .version(pckg.version)
  .usage('[options]')
  .action(() => {
    program.help()
  })

program
  .command('train')
  .description('Train your mine locally using a sonar smart contract')
  .option('-m, --mine-address <address>', 'Blockchain address for the mine to use')
  .option('-c, --contract-address <address>', 'Sonar smart contract address for the mine to use')
  .option('-i, --ipfs-url [url]', 'Url of the IPFS node (Default: "{host: \'localhost\', port: \'5001\', protocol: \'http\'})")')
  .option('-e, --ethereum-url [url]', 'Url to the ethereum network to use (Default: "http://localhost:8545")')
  // TODO: Add dev mode with watching
  .action((options) => {
    app.checkForModels(options.mineAddress, options.contractAddress, options.ethereumUrl, options.ipfsUrl)
  })

program.parse(process.argv)
