# mine.js 🗻⚒

[![Test Status](https://img.shields.io/travis/OpenMined/mine.js/master.svg?style=flat-square)](https://travis-ci.org/OpenMined/mine.js)
[![Coverage](https://img.shields.io/codecov/c/github/OpenMined/mine.js/master.svg?style=flat-square)](https://codecov.io/gh/OpenMined/Mine.js)

> nodeJS implementation of an [OpenMined](http://openmined.org) data mine

- [⬆️ Setup](#-setup)
    - [🎬 Prerequisites](#-prerequisites)
    - [📦 Installation](#-installation)
- [🏃 Usage](#-usage)
    - [🏁 Start](#-start)
    - [🌙 Command Line Interface](#-command-line-interface)
    - [🐞 Known Issues](#-known-issues)
- [⚖️ License](#-license)

## ⬆️ Setup

### 🎬 Prerequisites

* the `npm install` requires a python executable `>= v2.5.0 & < 3.0.0` (child-dep of web3)
* The code was developed using node **v8.1.2** and it is recommend to stick around this version.

### 📦 Installation

```sh
# install this project
npm install
# in addition you need the syft python library installed
pip install git+https://github.com/OpenMined/Syft.git
```

## 🏃 Usage

### 🏁 Start

You need to start the following things before you can use your mine:
* blockchain (testrpc for now)
* ipfs daemon

_Note: This seems to cause connection issues, as an alternative run the `start_env.sh` script if you have testrpc and ipfs installed locally_

This repository comes with a [docker-compose file](setup/docker-compose.yml) that allows you to bootstrap _ethereum_, _ipfs_ and any other services via one command. This will also start an instance of the latest `openmined/mine.js:edge` docker container with all local files mounted into it.
This allows development on the code with an auto-reloading docker environment.

_It will not work if you install new dependencies as those are not hot-loaded_

```sh
# to start the development environment
npm run dev
```

Alternatively you can only run the Mine (assuming you have testrpc and ipfs running somewhere):

```
 npm start -- --mine-address <your mine address> --contract-address <a sonar smart contract address>
```

You might want to head over to [pySonar](https://github.com/OpenMined/PySonar/blob/master/notebooks/Sonar%20-%20Decentralized%20Model%20Training%20Simulation%20(local%20blockchain).ipynb) and execute the notebook until **Step 1** to bootstrap your blockchain with some models. Feel free to execute additional steps to mock partially trained models.

```sh
npm start
```

You should see the following output:

![mine logs](stdout_progress.png)

### 🌙 Command Line Interface

To list available commands, execute `npm start -- --help`:

### 🐞 Known Issues

* with dockerized IPFS/testrpc there are a lot of connection issues
    * first run on a new docker env is working ~90%

## ⚖️ License

[Apache-2.0](https://github.com/OpenMined/mine.js/blob/master/LICENSE) by OpenMined contributors. If you have valid reason for us to consider going for a more permissive license please get in touch, we're not monsters 👾
