/**
 * Bootstrap the application
 * - create schedule to poll blockchain
 */

// const schedule = require('node-schedule')
global.config = require('./config')
const Sonar = require('./lib/sonar')
const ipfsAPI = require('ipfs-api')
const tmp = require('tmp')
const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

// magic numbers that need to be parsed via CLI
const contractAddress = '0x9c625c13048a5f5a374acc4ed6801211020f212a'
const mineAddress = '0x7d372bBA2139adfe8f4D68dA91B9f0Ea4dB1aef0' // 2nd account

const sonar = new Sonar(contractAddress, mineAddress)
console.log('reading accounts')
sonar.web3.eth.getAccounts()
  .then(a => console.log(a.slice(0, 10)))

const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

async function checkForModels () {
  const modelCount = await sonar.getNumModels()
  console.log(`${modelCount} models found`)

  for (let modelId = 0; modelId < modelCount; modelId++) {
    const model = await sonar.getModel(modelId)
    console.log(`model#${model.id} (${model.gradientCount}): ${model.weightsAddress}`)
    if (model.gradientCount > Infinity) { // disable for now
      try {
        const gradients = await sonar.getModelGradients(modelId, model.gradientCount - 1)
        console.log(` latest gradient#${gradients.id}: ${gradients.gradientsAddress} (weights: ${gradients.weightsAddress})`)
      } catch (e) {
        console.error(` could not fetch gradients: ${e}`)
      }
    }

    // download & train the model
    // -model ./encrypted.pickle -input_data data/diabetes_input.csv -target_data data/diabetes_output.csv -gradient ./encrypted_gradient.pickle
    const tmpDirectory = tmp.dirSync()
    const tmpPaths = {}
    Object.keys(config.syft.tmpFiles)
    .forEach(e => {
      tmpPaths[e] = path.join(tmpDirectory.name, config.syft.tmpFiles[e])
    })
    console.log(tmpPaths)
    const modelFh = fs.createWriteStream(tmpPaths.model)
    await new Promise((resolve, reject) => {
      ipfs.files.get(model.weightsAddress, (err, stream) => {
        if (err) return reject(err)
        stream.on('data', (file) => file.content.pipe(modelFh))
        stream.on('end', () => resolve(`weight stored to ${tmpPaths.model}`))
      })
    })
    // spawn syft
    const childOpts = {
      shell: true,
      stdio: 'inherit',
      cwd: '/developer/anoff/openmined-syft'
    }
    child_process.spawn(`source activate openmined && python bin/syft_cmd.py generate_gradient`, [`-model ${tmpPaths.model}`, `-input_data ${path.join(__dirname, 'data/mine/diabetes/diabetes_input.csv')}`, `-target_data ${path.join(__dirname, 'data/mine/diabetes/diabetes_output.csv')}`, `-gradient ${tmpPaths.gradient}`], childOpts)
  }
  // setTimeout(checkForModels, config.pollInterval * 1000)
}

checkForModels()
