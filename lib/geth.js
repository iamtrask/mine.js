/**
 * Manages the geth connection.
 */

const geth = require('geth')
const muted = require('./muted').muted()

const config = {
  cache: 512,
  bootnodes: 'enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303',
  networkid: 4,
  rpc: null,
  rpcapi: 'db,eth,net,web3,personal'
}

function connect (mineAddress, gethDataDir, gethPasswordFile) {
  return new Promise((resolve, reject) => {
    config.unlock = mineAddress
    config.datadir = gethDataDir
    if (gethPasswordFile) {
      config.password = gethPasswordFile
    }
    geth.start(config, {
      stdout: (data) => {
        if (data.toString().indexOf('Unlocking account') > -1) {
          console.log('Enter password to unlock geth (input hidden):')
          muted.question('', (password) => {
            geth.proc.stdin.write(password + '\n')
          })
        }
      },
      stderr: (data) => {
        if (data.toString().indexOf('Unlocked account') > -1) {
          muted.close()
          geth.trigger(null, geth.proc)
        }
      },
      close: (code) => {
        console.error('geth close, code:', code)
      }
    }, (err, proc) => {
      if (err) return reject(err)
      resolve(proc)
    })
  })
}

module.exports = {
  connect
}
