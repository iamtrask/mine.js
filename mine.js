/**
 * Bootstrap the application
 * - create schedule to poll blockchain
 */

// const schedule = require('node-schedule')
global.config = require('./config')
const Sonar = require('./lib/sonar')
const tmp = require('tmp')
const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn
const IPFS = require('./lib/ipfs')

function checkForModels (mineAddress, contractAddress, web3) {
  IPFS.connect()
  .then(ipfs => {
    console.log(`💾  Connected to IPFS. Online:`, ipfs.isOnline())
    trainModels(mineAddress, contractAddress, web3, ipfs)
  })
  .catch(err => console.error(`ipfs error: `, err))
}

async function trainModels (mineAddress, contractAddress, web3, ipfs) {
  const sonar = new Sonar(web3, contractAddress, mineAddress)

  console.log(`🔎️  Looking for models to train at ${contractAddress} for mine ${mineAddress}`)
  const modelCount = await sonar.getNumModels()
  console.log(`💃  ${modelCount} models found`)

  for (let modelId = 0; modelId < modelCount; modelId++) {
    const model = await sonar.getModel(modelId)
    console.log(` 💃  model#${model.id} with ${model.gradientCount} gradients at IPFS:${model.weightsAddress}`)
    if (model.gradientCount > Infinity) { // disable for now, should be > 0 to work ;)
      try {
        const gradients = await sonar.getModelGradients(modelId, model.gradientCount - 1)
        console.log(`latest gradient#${gradients.id}: ${gradients.gradientsAddress} (weights: ${gradients.weightsAddress})`)
      } catch (e) {
        console.error(` could not fetch gradients: ${e}`)
      }
    }

    // download & train the model
    // create folder structure
    const tmpDirectory = tmp.dirSync()
    const tmpPaths = {}
    Object.keys(config.syft.tmpFiles)
    .forEach(e => {
      tmpPaths[e] = path.join(tmpDirectory.name, config.syft.tmpFiles[e])
    })

    console.log(`  ⬇️  Downloading latest model`)
    // download the model from IPFS
    const modelFh = fs.createWriteStream(tmpPaths.model)
    await new Promise((resolve, reject) => {
      ipfs.files.get(model.weightsAddress, (err, stream) => {
        if (err) return reject(err)
        stream.on('data', (file) => file.content.pipe(modelFh))
        stream.on('end', () => resolve(`weight stored to ${tmpPaths.model}`))
      })
    })

    // spawn syft
    console.log(`  🏋️  Training the model latest model`)
    const childOpts = {
      shell: true,
      stdio: config.debug ? 'inherit' : ['ignore', 'ignore', process.stderr]
    }
    const trainStart = new Date()
    const sp = spawn(`syft_cmd generate_gradient`, [`-model ${tmpPaths.model}`, `-input_data ${path.join(__dirname, 'data/adapters/diabetes/diabetes_input.csv')}`, `-target_data ${path.join(__dirname, 'data/adapters/diabetes/diabetes_output.csv')}`, `-gradient ${tmpPaths.gradient}`], childOpts)
    await new Promise((resolve, reject) => {
      sp.on('close', code => {
        if (code) reject(new Error(`error while calling syft, code=${code}`))
        resolve()
      })
    })
    config.debug && console.log(`  🏋️  Finished training the model in ${(new Date() - trainStart) / 1000} s`)

    // put new gradients into IPFS
    console.log(`  ⬆️  Uploading new gradients to IPFS`)
    const gradientFh = fs.createReadStream(tmpPaths.gradient)
    const gradientsAddress = await new Promise((resolve, reject) => {
      const files = [{
        path: tmpPaths.gradient,
        content: gradientFh
      }]

      ipfs.files.add(files, (err, res) => {
        if (err) return console.error(err)
        const obj = res.find(e => e.path === tmpPaths.gradient)
        resolve(obj.hash)
      })
    })
    // upload new gradient address to sonar
    const response = await sonar.addGradient(modelId, gradientsAddress)
    console.log(config.debug ? `  ✅  Successfully propagated new gradient to Sonar with tx: ${response.transactionHash} for the price of ${response.gasUsed} gas  at IPFS:${gradientsAddress}` : `  ✅  Successfully propagated new gradient to Sonar at IPFS:${gradientsAddress}`)
  }
  if (config.pollInterval > 0) setTimeout(() => checkForModels(mineAddress, contractAddress, web3, ipfs), config.pollInterval * 1000)
}

module.exports = {
  checkForModels
}
