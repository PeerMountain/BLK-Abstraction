exports.confirmTransaction = function (req, res) {
	var result = multisig.confirmTransaction(req.body.transactionId);
	res.send(result);
}