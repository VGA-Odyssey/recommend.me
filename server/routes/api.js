var express = require('express');
var router = express.Router();
const clubs = require('../public/json/clubs.json');
const tags = require('../public/json/tags.json');
const recombee = require('recombee-api-client');
const key = require('../public/json/key');
const rqs = recombee.requests;

const client = new recombee.ApiClient(key.db, key.key);


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

router.get('/predict/:id', (req, res, next) => {
  const id = req.params.id;
  client.send(new rqs.RecommendItemsToItem(id, 1, 3))
  .then(recommended => {
    res.json(recommended)
  })
  .catch(error => console.log(error));    
});

router.get('/tags', function(req, res, next) {
  res.header("Content-Type", 'application/json');
  res.json(tags);
});


module.exports = router;
