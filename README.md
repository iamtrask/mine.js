# mine.js 🗻⚒

[![Tests develop](https://img.shields.io/travis/OpenMined/mine.js/develop.svg?style=flat-square)](https://travis-ci.org/OpenMined/mine.js)
[![Codecov branch](https://img.shields.io/codecov/c/github/OpenMined/mine.js/develop.svg?style=flat-square)](https://codecov.io/gh/OpenMined/Mine.js)

> nodeJS implementation of an [OpenMined](http://openmined.org) data mine

<!-- TOC depthFrom:2 -->

- [🏃‍ Usage](#‍-usage)
    - [📦 Installation](#-installation)
    - [🏁 Start](#-start)
    - [🌙 CLI](#-command-line-interface)
- [⚙️ (Missing) Features](#-missing-features)
- [🐞 Known Issues](#-known-issues)
- [⚖️ License](#-license)

<!-- /TOC -->

## 🏃‍ Usage

### 📦 Installation

The code was developed using node **v8.1.2** and it is recommend to stick around this version.

```sh
# install this project
npm install
# in addition you need the syft python library installed
pip install git+https://github.com/OpenMined/Syft.git
```

### 🏁 Start

You need to start the following things before you can use your mine:
* blockchain (testrpc for now)
* ipfs daemon

_Note: This seems to cause connection issues, as an alternative run the `start_env.sh` script if you have testrpc and ipfs installed locally_

This repository comes with a [docker-compose file](setup/docker-compose.yml) that allows you to bootstrap _ethereum_, _ipfs_ and any other services via one command.

```sh
# to start the development environment
npm run env-start

# or to stop
npm run env-stop
```

After you have the surrounding services mocked you can start the `Mine`:
```
 npm start -- --mine-address <your mine address> --contract-address <a sonar smart contract address>
```

or put the application into a developer mode with [nodemon](https://github.com/remy/nodemon) acting as as serversided live-reload
```
npm dev -- --mine-address <your mine address> --contract-address <a sonar smart contract address>

```

You might want to head over to [pySonar](https://github.com/OpenMined/PySonar/blob/master/notebooks/Sonar%20-%20Decentralized%20Model%20Training%20Simulation%20(local%20blockchain).ipynb) and execute the notebook until **Step 1** to bootstrap your blockchain with some models. Feel free to execute additional steps to mock partially trained models.

```sh
npm start
```

You should see the following output:

![mine logs](stdout_progress.png)

### 🌙 Command Line Interface

To list available commands, execute `npm start -- --help`:

## ⚙️ (Missing) Features

Currently the `Mine` polls a fixed `contractAddress` for available models and lists statistics.
Features that should follow:

* [x] Poll `Sonar` for available models
* [x] Download the model/weights via `IPFS`
* [x] Train the model using `syft`
* [x] Get `contractAddress`/`mineAddress` via arguments/env variables
* [ ] Filter models for those matching available training data (requires feature change on Sonar contract)
* [ ] Proper docker setup to allow multiple mines

## 🐞 Known Issues

* the `npm install` requires a python executable `>= v2.5.0 & < 3.0.0` (child-dep of web3)
* with dockerized IPFS/testrpc there are a lot of connection issues
    * first run on a new docker env is working ~90%

## ⚖️ License

This code is licensed under [Apache-2.0](LICENSE). If you have valid reason for us to consider going for a more permissive license please get in touch, we're not monsters 👾
