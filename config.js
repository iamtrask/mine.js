const config = {
  ethereum: {
    port: 8545,
    host: 'localhost'
  },
  ipfs: {
    port: 4001,
    host: 'localhost'
  },
  pollInterval: 30, // [s] how often to check sonar for new models, 0 to disable
  syft: {
    tmpFiles: {
      model: 'model.pickle',
      target: 'output.csv',
      gradient: 'gradient.pickle'
    }
  },
  debug: false // MOAR logs
}

module.exports = config
