/**
 * Mine-side implementation to interact with the Sonar smart contract from a miners perspective
 */

const fs = require('fs')
const Web3 = require('web3')

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
    return {
      ownerAddress: data[0],
      bounty: data[1], // in Wei,
      initialError: data[2],
      targetError: data[3],
      ipfsAddress: data[4]
    }
  }
}

module.exports = Sonar
