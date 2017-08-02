#!/usr/bin/env node

const program = require('commander')
const pkg = require('./package.json')

program
  .version(pkg.version)
  .option('-d, --data', 'Path to data directory')
  .parse(process.argv)
