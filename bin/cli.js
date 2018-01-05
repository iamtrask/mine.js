#!/usr/bin/env node
const program = require('commander')
const Mine = require('../mine.js')
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
  .option('-m, --mine-address <hexstring or auto>', 'Blockchain address for the mine to use. `auto`` sets the mine to pick a random account.')
  .option('-c, --contract-address <hexstring>', 'Sonar smart contract address for the mine to use')
  .option('-i, --ipfs-url [url]', 'Url of the IPFS node (Default: "http://localhost:5001")')
  .option('-e, --ethereum-url [url]', 'Url to the ethereum network to use (Default: "http://localhost:8545")')
  .option('-e, --geth-password-file [path]', 'Optional: Path to the geth password file to use')
  .option('-e, --geth-data-dir [path]', 'Path to the geth data-dir (Default: "$HOME/Library/Ethereum/rinkeby/")')
  // TODO: Add dev mode with watching
  .action(async (options) => {
    let mineAddress = options.mineAddress
    const contractAddress = options.contractAddress

    // HACK: Commander required only works with empty arguments
    if (!mineAddress) return console.error('--mine-address required')
    if (!contractAddress) return console.error('--contract-address required')
    const ethereumUrl = options.ethereumUrl || 'http://localhost:8545'
    const gethPasswordFile = options.gethPasswordFile
    const gethDataDir = options.gethDataDir || '$HOME/Library/Ethereum/rinkeby/'

    var mine = new Mine(mineAddress, contractAddress, ethereumUrl)

    mine.on('log', (msg) => {
      console.log(msg)
    })

    mine.on('error', (err) => {
      console.error('error', err)
    })

    mine.on('connect', async () => {
      const models = await mine.getModels()

      // Automatically train the first model
      if (models[0]) {
        mine.trainModel(models[0])
      }
    })

    mine.connect(gethDataDir, gethPasswordFile)
  })

program
  .command('help', {isDefault: true})

program.parse(process.argv)
