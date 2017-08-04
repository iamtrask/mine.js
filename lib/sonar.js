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
   * Convert an Array of hexStrings to Base58 address.
   * @param {Array} hexStrings
   */
  arrayToAddress (hexStrings) {
    return hexStrings.map(e => Buffer.from(e.slice(2), 'hex').toString().split('\x00')[0])
    .join('')
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
      id,
      ownerAddress: data[0],
      bounty: data[1], // in Wei,
      initialError: data[2],
      targetError: data[3],
      weightsAddress: this.arrayToAddress(data[4]),
      gradientCount: gradients
    }
  }

  async getModelGradients (modelId, gradientId = -1) {
    // use latest gradients if none is specified
    if (gradientId < 0) {
      const m = await this.getModel(modelId)
      gradientId = m.gradientCount - 1
    }
    let gradients = await this._call('getGradient', modelId, gradientId)
    gradients = Object.values(gradients) // convert pseudo-array to array
    const [, from, gradientsAddress, newError, weightsAddress] = gradients

    return {
      id: gradientId,
      minerAddress: from,
      gradientsAddress: this.arrayToAddress(gradientsAddress),
      newError,
      weightsAddress: this.arrayToAddress(weightsAddress)
    }
  }

  destroy () {
  }
}

module.exports = Sonar
