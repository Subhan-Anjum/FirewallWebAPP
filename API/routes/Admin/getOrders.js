var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/getOrders')

router.get('/', controller.getOrders)
  
module.exports = router;