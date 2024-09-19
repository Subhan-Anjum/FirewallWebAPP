var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/getReviews')

router.get('/', controller.getReviews)
  
module.exports = router;