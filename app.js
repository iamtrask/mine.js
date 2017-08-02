/**
 * Bootstrap the application
 * - create schedule to poll blockchain
 */

const fs = require('fs')
const Web3 = require('web3')
const schedule = require('node-schedule')
global.config = require('./config')
const config = global.config

const contract = JSON.parse(fs.readFileSync('./lib/ModelRepository.abi', 'utf8'))
// magic numbers that need to be parsed via CLI
const contractAddress = '0x9d63e02fc482c48e38c280ba882a74ec03df4739'
const mineAddress = '0x962b91D9aD11488960Cdc4552FF820520D12Ed23'
const web3 = new Web3(new Web3.providers.HttpProvider(`http://${config.ethereum.host}:${config.ethereum.port}`))
web3.eth.getAccounts().then(acc => console.log(acc.slice(0, 10)))

const modelRepository = new web3.eth.Contract(contract, contractAddress)

modelRepository.methods.getNumModels().call({from: mineAddress}).then(res => console.log(`${parseInt(res[0])} models on the contract`))

for (let modelId = 0; modelId < 1; modelId++) {
  modelRepository.methods.getModel(modelId).call({from: mineAddress}).then(d => console.log(`model#${modelId}: owner=${d[0]}, bounty=${web3.utils.fromWei(d[1], 'ether')} ETH, initial_error=${d[2]}, target_error=${d[3]}, ipfsAddress=${d[4]}`))
}

// run every 5 seconds
const s = schedule.scheduleJob('*/5 * * * * *', () => {
})
