'use strict';

var UrlHandler = require(process.cwd() + '/app/controllers/urlHandler.server.js');

module.exports = function (app, db) {
   var urlHandler = new UrlHandler(db);

   app.route('/new/*')
      .get(urlHandler.addUrl);

   app.route('/:id')
      .get(urlHandler.redirect);

   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });

};
