/**
 * Creates a muted interface.
 */

const Readline = require('readline')
const Writable = require('stream').Writable

function muted () {
  var writable = new Writable({
    write: (chunk, encoding, cb) => {
      if (!this.muted) process.stdout.write(chunk, encoding)
      cb()
    }
  })

  writable.muted = false

  var readline = Readline.createInterface({
    input: process.stdin,
    output: writable,
    terminal: true
  })

  writable.muted = true

  return readline
}

module.exports = {
  muted
}
