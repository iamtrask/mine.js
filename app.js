/**
 * Bootstrap the application
 * - create schedule to poll blockchain
 */

const schedule = require('node-schedule')
global.config = require('./config')
const Sonar = require('./lib/sonar')

// magic numbers that need to be parsed via CLI
const contractAddress = '0x9d63e02fc482c48e38c280ba882a74ec03df4739'
const mineAddress = '0x962b91D9aD11488960Cdc4552FF820520D12Ed23'

const sonar = new Sonar(contractAddress, mineAddress)
async function checkForModels () {
  const modelCount = await sonar.getNumModels()
  console.log(`${modelCount} models found`)

  for (let modelId = 0; modelId < modelCount; modelId++) {
    console.log(modelId)
    const model = await sonar.getModel(modelId)
    console.log(`model#${modelId}: ${JSON.stringify(model)}`)
  }
  setTimeout(checkForModels, config.pollInterval * 1000)
}

checkForModels()
