import test from 'ava'
// import td from 'testdouble' // probably needed later one :D
import Sonar from './sonar.js'

global.config = {
  ethereum: {
    host: 'dummy'
  },
  ipfs: {
    host: 'ipfshost'
  }
}

class ContractStub {
}
const web3Stub = {
  eth: {
    Contract: ContractStub
  }
}
const validAddress = '0x' + '1'.repeat(40)
const invalidAddress = 'asdf'

test('Constructor should throw on missing args', t => {
  t.throws(() => new Sonar(), 'Pass a valid web3 instance')
  t.throws(() => new Sonar(web3Stub), 'contractAddress should be a hexstring')
  t.throws(() => new Sonar(web3Stub, validAddress), 'mineAddress should be a hexstring')
  t.throws(() => new Sonar(web3Stub, invalidAddress, validAddress), 'contractAddress should be a hexstring')
  t.throws(() => new Sonar(web3Stub, validAddress, invalidAddress), 'mineAddress should be a hexstring')
})

test('Constructor should throw on invalid args', t => {
  t.throws(() => new Sonar(web3Stub, invalidAddress, validAddress), 'contractAddress should be a hexstring')
  t.throws(() => new Sonar(web3Stub, validAddress, invalidAddress), 'mineAddress should be a hexstring')
})

test('Constructor should return instance', t => {
  const s = new Sonar(web3Stub, validAddress, validAddress)
  t.true(s instanceof Sonar)
})
