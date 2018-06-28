var Web3 = require('web3');
var config = require('./config.json');
var web3 = new Web3(new Web3.providers.HttpProvider(config.HttpProvider));
var sendQueue = require('./Rabbitmq/writer.js');


var ClaimRegistryContract_json = require('./contracts/ClaimsRegistry');
var AttestationManagerContract_json = require('./contracts/AttestationManager');


exports.writeClaim = function (subject, value) {
	var ClaimRegistry = web3.eth.contract(ClaimRegistryContract_json.abi).at(config.claimRegistryAddress);
	var transaction = ClaimRegistry.setClaim(subject, web3.sha3(value, {encoding: 'hex'}), value, {from:config.AEaddress, gas:4612387, gasPrice:web3.eth.gasPrice});
	console.log("key " + web3.sha3(value, {encoding: 'hex'}));
	sendQueue.sendMessageByQueue(JSON.stringify({"transactionID" : transaction}));
	var mined;
	var transactionStatus;
	var interval = setInterval(function(){
		transactionStatus = isMined(transaction);
		mined=transactionStatus.blockNumber;
		if (mined != undefined) {
			clearInterval(interval);
			sendQueue.sendMessageByQueue(JSON.stringify(transactionStatus));
		}
	},1000);
	return {"transaction" : transaction};
}

exports.getClaim = function(subject, key){
	var ClaimRegistry = web3.eth.contract(ClaimRegistryContract_json.abi).at(config.claimRegistryAddress);
	var data = web3.toAscii(ClaimRegistry.getClaim(config.AEaddress, subject, key)).replace(/\0/g, '');
	console.log("value of the message: " + data);
	sendQueue.sendMessageByQueue(JSON.stringify(data));
	return {"value" : data};
}

var isMined=function(argument) {
	var transaction = web3.eth.getTransaction(argument);
	if(transaction){
		var receipt = web3.eth.getTransactionReceipt(argument);
		if (receipt) {
			var blockNumber = transaction.blockNumber;
			var input = transaction.input;

			var transactionHash =transaction.hash;
			if (receipt.logs[0]) {
				var status = receipt.logs[0].type;
			}else {
				var status = "Error encountered during contract execution";
			}
			var result = {"txID" : transactionHash, "status" : status, "blockNumber" : blockNumber, "input":input};
			//console.log("Queried transaction status: " + JSON.stringify(result));
			return result;
		}else{
			return {"txID" : transaction.hash, "status" : "NotBroadcasted", "blockNumber" : null};
		}
	}else{
		//console.log("Queried transaction status: Transaction does not exist in this node");
		return ({"Error" : "Transaction does not exist in this node"});
	}
}

exports.addAE = function(iden, address){
	var AttestationManager = web3.eth.contract(AttestationManagerContract_json.abi).at(config.AttestationManager);
	var transaction = AttestationManager.addAE(iden, address, {from:config.AEaddress, gas:4612387, gasPrice:web3.eth.gasPrice});
	console.log("AE id: "+iden+" added, transactionHX: "+transaction);
	return {"transaction" : transaction};
}
exports.removeAE = function(iden){
	var AttestationManager = web3.eth.contract(AttestationManagerContract_json.abi).at(config.AttestationManager);
	var transaction = AttestationManager.removeAE(iden, {from:config.AEaddress, gas:4612387, gasPrice:web3.eth.gasPrice});
	console.log("AE id: "+iden+" removed, transactionHX: "+transaction);
	return {"transaction" : transaction};
}
exports.getAE = function(iden){
	var AttestationManager = web3.eth.contract(AttestationManagerContract_json.abi).at(config.AttestationManager);
	var result = AttestationManager.attestationEngine(iden);	
	console.log("AE id: "+iden+" with address: "+result);
	return {"addres of AE" : result};
}
