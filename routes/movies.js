var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET movies listing. */
router.get('/', function(request, response, next) {
  response.render('movies', { ctrl: 'controllers.movies.VideoCtrl' });
});

router.get('/movies', function(request, response, next) {
  fs.readFile('data/movies.json', 'utf8', function(error, data) {
    if (error) {
      response.writeHead(500);
      response.end();
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(data, 'utf-8');
    }
  });
});

module.exports = router;
