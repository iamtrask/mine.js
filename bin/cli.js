#!/usr/bin/env node
const program = require('commander')
const app = require('../mine.js')
const pckg = require('../package.json')
const Web3 = require('web3')

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
  .option('-m, --mine-address <hexstring or auto>', 'Blockchain address for the mine to use. `auto`` sets the mine to pick a random account.')
  .option('-c, --contract-address <hexstring>', 'Sonar smart contract address for the mine to use')
  .option('-i, --ipfs-url [url]', 'Url of the IPFS node (Default: "http://localhost:5001")')
  .option('-e, --ethereum-url [url]', 'Url to the ethereum network to use (Default: "http://localhost:8545")')
  // TODO: Add dev mode with watching
  .action(async (options) => {
    let mineAddress = options.mineAddress
    const contractAddress = options.contractAddress

    // HACK: Commander required only works with empty arguments
    if (!mineAddress) return console.error('--mine-address required')
    if (!contractAddress) return console.error('--contract-address required')
    const ethereumUrl = options.ethereumUrl || 'http://localhost:8545'

    const web3 = new Web3(new Web3.providers.HttpProvider(ethereumUrl))

    if (mineAddress === 'auto') {
      const mineAddresses = await web3.eth.getAccounts()
      mineAddress = mineAddresses.length && mineAddresses[0]
    }

    app.checkForModels(mineAddress, contractAddress, web3)
  })

program
  .command('help', {isDefault: true})

program.parse(process.argv)
