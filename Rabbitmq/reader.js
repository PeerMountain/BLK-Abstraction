#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var amqpURL = "amqp://rerxszft:60yxnTE1GcCdOKNjYDaWI_cc-gPLUd4c@emu.rmq.cloudamqp.com/rerxszft";
var BLKController = require('../BLKController.js');

amqp.connect(amqpURL, function(err, conn) {
	conn.createChannel(function(err, ch) {
		var q = 'cloudAMQP';

		ch.assertQueue(q, {durable: false});
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
		ch.consume(q, function(msg) {
			try{
				var message = JSON.parse(msg.content.toString());

				if(message.setClaim != undefined){
					//console.log(message.subject);
					//console.log(message.msgContent);
					console.log(" Writing claim to blockchain", msg.content.toString());
					BLKController.writeClaim(message.subject, JSON.stringify(message.msgContent));
				}
				else{

				if(message.getClaim != undefined){
					console.log(" Getting claim from blockchain", msg.content.toString());
					BLKController.getClaim(message.subject, message.key);
				}else{
					console.log("message received "+JSON.stringify(message));

				}}
			}catch (e){
				if(e.message.includes("Unexpected token")){
				console.log("Error: the message is not JSON "+e);					
				}else{
					console.log("unknow error: "+e);
				}
			}
		}, {noAck: true});
	});
});