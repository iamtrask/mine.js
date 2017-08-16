#!/usr/bin/env node
const program = require('commander')
const app = require('./app.js')

program
	.version('0.0.1')
	.usage('[options]')
  .option('-m, --mine-address', 'Blockchain address for the mine to use. Default: 0xF520Db140a8EB2032b11Bba47A65e6Ba04d9a35E')
  .option('-c, --contract-address', 'Sonar smart contract address for the mine to use. Default: 0xdde11dad6a87e03818aea3fde7b790b644353ccc')
  .option('-i, --ipfs-url', 'Url of the IPFS node')
  .option('-e, --ethereum-url', 'Url to the ethereum network to use')
	.parse(process.argv)

console.log('running')

if(!program.args.length) {
	program.help()
} else {
  const mineAddress = program.mineAddress || '0xF520Db140a8EB2032b11Bba47A65e6Ba04d9a35E' // 2nd account
  const contractAddress = program.contractAddress || '0xdde11dad6a87e03818aea3fde7b790b644353ccc'
  const ipfsUrl = program.ipfsUrl || {host: 'localhost', port: '5001', protocol: 'http'}
  app.checkForModels(mineAddress, contractAddress, program.ethereumUrl, program.ipfsUrl)
}
