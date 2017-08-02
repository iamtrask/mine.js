/**
 * Bootstrap the application
 * - create schedule to poll blockchain
 */

const fs = require('fs')
const Web3 = require('web3')
const schedule = require('node-schedule')

// run every 5 seconds
const s = schedule.scheduleJob('*/5 * * * * *', () => {
  console.log('The answer to life, the universe, and everything!')
})
