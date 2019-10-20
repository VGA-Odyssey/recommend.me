var express = require('express');
var router = express.Router();
const clubs = require('../public/json/clubs.json');
const tags = require('../public/json/tags.json')

/* GET home page. */
router.get('/clubs', function(req, res, next) {
  res.header("Content-Type", 'application/json');
  res.json(clubs);
});

router.get('/clubs/:id', (req, res, next) => {
  const id = req.params.id;
  let result = {};
  
  clubs.map(club => {
    if(club.id === id){
      result = {...club};
    }
  });

  res.header("Content-Type", 'application/json');
  res.json(result);

});

router.get('/tags', function(req, res, next) {
  res.header("Content-Type", 'application/json');
  res.json(tags);
});


module.exports = router;
