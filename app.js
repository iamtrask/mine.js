/**
 * Bootstrap the application
 * - create schedule to poll blockchain
 */

// const schedule = require('node-schedule')
global.config = require('./config')
const Sonar = require('./lib/sonar')

// magic numbers that need to be parsed via CLI
const contractAddress = '0x9c625c13048a5f5a374acc4ed6801211020f212a'
const mineAddress = '0x7d372bBA2139adfe8f4D68dA91B9f0Ea4dB1aef0' // 2nd account

const sonar = new Sonar(contractAddress, mineAddress)
sonar.web3.eth.getAccounts()
  .then(a => console.log(a.slice(0, 10)))

async function checkForModels () {
  const modelCount = await sonar.getNumModels()
  console.log(`${modelCount} models found`)

  for (let modelId = 0; modelId < modelCount; modelId++) {
    const model = await sonar.getModel(modelId)
    console.log(`model#${modelId}: ${model.weightsAddress}`)
    if (model.gradientCount > Infinity) { // disable for now
      const gradients = await sonar.getModelGradients(modelId, model.gradientCount - 1)
      console.log(`latest gradient#${gradients.id}: ${gradients.weightsAddress}`)
    }
  }

  // setTimeout(checkForModels, config.pollInterval * 1000)
}

checkForModels()
