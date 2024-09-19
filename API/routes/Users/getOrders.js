var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/getOrders')

router.get('/', controller.getOrders)
  
module.exports = router;