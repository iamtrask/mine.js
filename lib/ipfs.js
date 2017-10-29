/**
 * Manages the IPFS connection.
 */

const IPFS = require('ipfs')

function connect () {
  return new Promise((resolve, reject) => {
    const node = new IPFS()
    node.on('start', () => resolve(node))
    node.on('error', (err) => reject(err))
  })
}

module.exports = {
  connect
}
