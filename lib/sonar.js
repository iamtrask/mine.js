/**
 * Mine-side implementation to interact with the Sonar smart contract from a miners perspective
 */

const fs = require('fs')
const Web3 = require('web3')
const assert = require('assert')

class Sonar {
  constructor (contractAddress, mineAddress, options = {}) {
    options.host = options.host || config.ethereum.host
    options.port = options.port || config.ethereum.port
    const abi = JSON.parse(fs.readFileSync('./lib/ModelRepository.abi', 'utf8'))
    const web3 = new Web3(new Web3.providers.HttpProvider(`http://${options.host}:${options.port}`))
    const contract = new web3.eth.Contract(abi, contractAddress)
    this.web3 = web3
    this.contract = contract
    return this
  }

  _call (method, ...args) {
    return this.contract.methods[method](...args).call({from: this.mineAddress})
  }

  /**
   * Return the number of available models on the contract.
   */
  getNumModels () {
    return this._call('getNumModels')
  }

  /**
   * Get details about a model via its id.
   * @param {number} id
   */
  async getModel (id) {
    const data = await this._call('getModel', id)
    const gradients = await this._call('getNumGradientsforModel', id)
    return {
      ownerAddress: data[0],
      bounty: data[1], // in Wei,
      initialError: data[2],
      targetError: data[3],
      // TODO: figure out how to get IPFS addresses out of those weird arrays
      weightsAddress: '0x' + (parseInt(data[4][0]) + parseInt(data[4][1])).toString(16),
      gradientCount: gradients
    }
  }

  async getModelGradients (modelId, gradientId = -1) {
    if (gradientId < 0) {
      const m = await this.getModel(modelId)
      gradientId = m.gradientCount - 1
    }
    let gradients = await this._call('getGradient', modelId, gradientId)
    gradients = Object.values(gradients) // convert pseudo-array to array
    const [_id, from, gradientsAddress, newError, weightsAddress] = gradients
    assert(parseInt(_id) === gradientId, `requested gradientId=${gradientId} differs from received Id=${_id}`)

    return {
      id: parseInt(_id),
      minerAddress: from,
      // TODO: figure out how to get IPFS addresses out of those weird arrays
      gradientsAddress,
      newError,
      // TODO: figure out how to get IPFS addresses out of those weird arrays
      weightsAddress
    }
  }
}

module.exports = Sonar
