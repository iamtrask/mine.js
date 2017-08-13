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
const spawn = require('child_process').spawn

// magic numbers that need to be parsed via CLI
const contractAddress = '0x656385f6914469fff55c34299258ce965aa134bf'
const mineAddress = '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01' // additional account w/ funds

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
    if (model.gradientCount > Infinity) { // disable for now, should be > 0 to work ;)
      try {
        const gradients = await sonar.getModelGradients(modelId, model.gradientCount - 1)
        console.log(` latest gradient#${gradients.id}: ${gradients.gradientsAddress} (weights: ${gradients.weightsAddress})`)
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
    const childOpts = {
      shell: true,
      stdio: config.debug ? 'inherit' : ['ignore', 'ignore', process.stderr]
    }
    const sp = spawn(`syft_cmd generate_gradient`, [`-model ${tmpPaths.model}`, `-input_data ${path.join(__dirname, 'data/mine/diabetes/diabetes_input.csv')}`, `-target_data ${path.join(__dirname, 'data/mine/diabetes/diabetes_output.csv')}`, `-gradient ${tmpPaths.gradient}`], childOpts)
    await new Promise((resolve, reject) => {
      sp.on('close', code => {
        if (code) reject(new Error(`error while calling syft, code=${code}`))
        resolve()
      })
    })
    console.log('DONE TRAINING \\o/!')

    // put new gradients into IPFS
    // deploy_trans = self.get_transaction(from_addr).addGradient(model_id,[ipfs_address[0:32],ipfs_address[32:]])
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
    console.log(response)
  }
  if (config.pollInterval > 0) setTimeout(checkForModels, config.pollInterval * 1000)
}

checkForModels()

/*
0x516d51316142636f727a6e53364a61524d735a7a4273524c756a57563846464b, 0x4b57707854596e48644266327270000000000000000000000000000000000000
'QmQ1aBcorznS6JaRMsZzBsRLujWV8FFK', 'KWpxTYnHdBf2rp\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'

'QmQ1aBcorznS6JaRMsZzBsRLujWV8FFKKWpxTYnHdBf2rp'
*/
