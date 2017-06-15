let router = require('express').Router();
let models = require('../models');
let Page = models.Page;
let User = models.User;

router.post('/', function(req, res, next){
  console.log(req.body);
  User.findOrCreate({email: req.body.email, name: req.body.name})
  .then(user => {
    res.json(user);
  })
})


router.get('/add', function(req, res, next){
  res.render('addpage.html');
})

router.get('/:urlTitle', function(req, res, next){
  Page.findOne({urlTitle: req.params.urlTitle}).exec()
  .then(foundPage => {
    res.render('wikipage', {page: foundPage});
  }).catch(next);
})


module.exports = router;
