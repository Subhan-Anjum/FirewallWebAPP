var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/buyProduct')

router.post('/', controller.buyProduct)
  
module.exports = router;