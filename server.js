'use strict';

var express = require('express');
var mongo = require('mongodb');
var routes = require('./app/routes/index.js');

var app = express();

mongo.connect('mongodb://heroku_3wp0zk6j:dqtncniu7opl40ak3a1drv7i08@ds019058.mlab.com:19058/heroku_3wp0zk6j', function (err, db) {

   if (err) {
      throw new Error('Database failed to connect! '+ err);
   } else {
      console.log('Successfully connected to MongoDB.');
   }

   app.use('/public', express.static(process.cwd() + '/public'));
   app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

   routes(app, db);

   var port = process.env.PORT || 3000;
   app.listen(port , function () {
      console.log('Node.js listening on port '+port+'...');
   });

});
