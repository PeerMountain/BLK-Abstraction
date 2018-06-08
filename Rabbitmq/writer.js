#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var amqpURL = "amqp://rerxszft:60yxnTE1GcCdOKNjYDaWI_cc-gPLUd4c@emu.rmq.cloudamqp.com/rerxszft";
var channel;
var q = 'cloudAMQP';

amqp.connect(amqpURL, function(err, conn) {
  conn.createChannel(function(err, ch) {

    var msgSetClaim = JSON.stringify({"setClaim" : "set", "subject" : "0x4aBfE88c3a57f205E8D34Fa061FC4e019DA79167", "msgContent" : "hola esto es un mensaje"});
    var msgSetClaim2 = JSON.stringify({"setClaim" : "set", "subject" : "0xD6c20237d98917ad3F56b4F19e444034EF6C934c", "msgContent" : {"field1":"information about"}});

    var msgGetClaim = JSON.stringify({"getClaim" : "get", "subject" : "0x4aBfE88c3a57f205E8D34Fa061FC4e019DA79167", "key" : "hola esto es un mensaje"});
    var msgGetClaim2 = JSON.stringify({"getClaim" : "get", "subject" : "0xD6c20237d98917ad3F56b4F19e444034EF6C934c", "key" : "0xa8a44765bfddbde1734a4e9c2977d79cc5a076240ca67769a782d8a8e7db8849"});
    var msg2 = 'Hello Bob, im Charlie';


    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    //ch.sendToQueue(q, new Buffer(msgSetClaim));

    ch.sendToQueue(q, new Buffer(msgSetClaim2));
    setTimeout(function(){
          ch.sendToQueue(q, new Buffer(msgGetClaim2));

        },10000);
    //ch.sendToQueue(q, new Buffer(msg2));
    channel = ch;
  });
  //setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

exports.sendMessageByQueue = function (message) {
  try {
    channel.sendToQueue(q, new Buffer(message));
  } catch (e) {
    console.log("Error: imposible to send the message " +e);
  }
}