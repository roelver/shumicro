'use strict';

function urlHandler (db) {

   var urls = db.collection('urls');
   var appRoot = process.env.HEROKU_URL || "http://localhost:3000/";

   this.addUrl = function(req, res) {

      var newUrl = req.params['0']; // catch all

      if (newUrl.indexOf('https://') <0 && newUrl.indexOf('http://') <0) {
         handleError(res, 500, "Invalid Url format.");
      }
      else {
         // Check if the URL already exists
         urls.findOne({"original_url": newUrl},{original_url: true, short_url: true}, function (err, result) {
            if (err) {
               throw err;
            }
            if (result) {
               res.json({"original_url": result.original_url, 
                         "short_url": appRoot + result.short_url});
            }
            else { 

               var record = { "original_url": newUrl, 
                  "short_url": generateId(5)};

               urls.insert(record, {w: 1}, function (err, result) {
                  if (err) {
                     throw err;
                  }
                  if (record) {
                     res.json({"original_url": record.original_url, 
                               "short_url": appRoot+record.short_url});
                  }

               });
            }
         });
      }
   };


   this.redirect = function (req, res) {
      var myId = req.params.id;

      if (myId && myId.length > 0) {
         urls.findOne({"short_url": myId}, {original_url: true},function (err, result) {
            if (err) {
               throw err;
            }

            if (result) {
               res.writeHead(302, {'Location': result.original_url});
               res.end();
            } 
            else {
               handleError(res, 404, "Shortened id does not exist");
            }
         });
      }
   };

   var generateId = function(len) {
      var chars = "abcdefghijklmnopqrstuvwxyz1234567890";
      var result = "";
      for (var i=0;i<len;i++) {
         result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
   };

   var handleError = function(res, errCode, errMsg) {
      res.status(errCode).send({ error: errMsg});
   }

}

module.exports = urlHandler;
