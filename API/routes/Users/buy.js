var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/buy')

router.get('/', controller.buy)
  
module.exports = router;