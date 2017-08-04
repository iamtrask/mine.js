const config = {
  ethereum: {
    port: 8545,
    host: 'localhost'
  },
  ipfs: {
    port: 4001,
    host: 'localhost'
  },
  pollInterval: 5 // [s] how often to check sonar for new models
}

module.exports = config
