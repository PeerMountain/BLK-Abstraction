var Web3 = require('web3'),
config = require('./config.json'),
web3 = new Web3(new Web3.providers.HttpProvider(config.HttpProvider));


var config = require('./config.json');
var server = require('./server');