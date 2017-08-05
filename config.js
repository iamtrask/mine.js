const config = {
  ethereum: {
    port: 8545,
    host: 'localhost'
  },
  ipfs: {
    port: 4001,
    host: 'localhost'
  },
  pollInterval: 5, // [s] how often to check sonar for new models
  syft: {
    tmpFiles: {
      model: 'model.pickle',
      target: 'output.csv',
      gradient: 'gradient.pickle'
    }
  }
}

module.exports = config
