'use strict';
module.exports = function(app) {
	var controller = require('../controllers/BLKController');

	app.route('/ae')
	.post(controller.addAE)
	.delete(controller.removeAE);

	app.route('/claim')
	.post(controller.writeClaim);
	
	app.route('/claim/:subject/:key')
	.get(controller.getClaim);
};
