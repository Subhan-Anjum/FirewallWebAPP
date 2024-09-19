var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/giveReview');

router.post('/', controller.givereview)
  
module.exports = router;