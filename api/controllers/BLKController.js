'use strict';
var blk = require('../../BLK');


exports.addAE = function (req, res) {
	var result = blk.addAE(req.body.iden, req.body.address);
	console.log("addAE");
	res.json(result);
} 

exports.removeAE = function (req, res) {
	var result = blk.removeAE(req.body.iden);
	console.log("removeAE");
	res.json(result);
}

exports.writeClaim = function (req, res) {
	var result = blk.writeClaim(req.body.subject, req.body.value);
	console.log("writeClaim");
	res.json(result);
}

exports.getClaim = function (req, res) {
	var result = blk.getClaim(req.params.subject, req.params.key);
	console.log("getClaim");
	res.json(result);
}