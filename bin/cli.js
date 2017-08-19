#!/usr/bin/env node
const program = require('commander')
const app = require('../mine.js')
const pckg = require('../package.json')

program
  .version(pckg.version)
  .usage('[options]')
  // HACK: Commander only registers `-V`
  .option('-v, --version', 'output the version number')
  .on('option:version', () => {
    return console.log(program._version)
  })
  .action(() => {
    program.help()
  })

program
  .command('train')
  .description('Train your mine locally using a sonar smart contract')
  .option('-m, --mine-address <hexstring>', 'Blockchain address for the mine to use')
  .option('-c, --contract-address <hexstring>', 'Sonar smart contract address for the mine to use')
  .option('-i, --ipfs-url [url]', 'Url of the IPFS node (Default: "/ip4/127.0.0.1/tcp/5001")')
  .option('-e, --ethereum-url [url]', 'Url to the ethereum network to use (Default: "http://localhost:8545")')
  // TODO: Add dev mode with watching
  .action((options) => {
    const mineAddress = options.mineAddress
    const contractAddress = options.contractAddress

    // HACK: Commander required only works with empty arguments
    if (!mineAddress) return console.log('--mine-address required')
    if (!contractAddress) return console.log('--contract-address required')

    const ethereumUrl = options.ethereumUrl || 'http://localhost:8545'
    const ipfsUrl = options.ipfsUrl || '/ip4/127.0.0.1/tcp/5001'
    app.checkForModels(mineAddress, contractAddress, ethereumUrl, ipfsUrl)
  })

program.parse(process.argv)
