/**
 * Mine-side implementation to interact with the Sonar smart contract from a miners perspective
 */

const fs = require('fs')
const assert = require('assert')

class Sonar {
  constructor (web3, contractAddress, mineAddress, options = {}) {
    const isValidAddress = a => a.slice(0, 2).toLowerCase() === '0x' && a.length === 42
    assert(typeof web3 === 'object', 'Pass a valid web3 instance')
    assert(typeof contractAddress === 'string' && isValidAddress(contractAddress), 'contractAddress should be a hexstring')
    assert(typeof mineAddress === 'string' && isValidAddress(mineAddress), 'mineAddress should be a hexstring')
    options.host = options.host || config.ethereum.host
    options.port = options.port || config.ethereum.port
    const abi = JSON.parse(fs.readFileSync('./lib/ModelRepository.abi', 'utf8'))
    const contract = new web3.eth.Contract(abi, contractAddress)
    this.web3 = web3
    this.contract = contract
    this.mineAddress = mineAddress
    this.contractAddress = contractAddress
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
   * Convert Base58 address to an Array that fits into Sonar contract.
   * @param {String} ipfsAddress
   */
  addressToArray (ipfsAddress) {
    const targetLength = 64 // fill the address with 0 at the end to this length
    const parts = ipfsAddress.match(/.{1,32}/g) // split into 32-chars
    .map(part => part.split('').map(c => c.charCodeAt(0).toString(16)).join('')) // turn each part into a hexString address
    .map(part => part.concat('0'.repeat(targetLength - part.length))) // 0 pad at the end
    .map(part => '0x' + part) // prefix as hex
    return parts
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

  async addGradient (modelId, gradientsAddress) {
    return this.contract.methods.addGradient(modelId, this.addressToArray(gradientsAddress)).send({from: this.mineAddress, to: this.contractAddress, gas: 500000})
  }
  destroy () {
  }
}

module.exports = Sonar
