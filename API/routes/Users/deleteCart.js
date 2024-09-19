var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/deleteCart')

router.delete('/', controller.deleteCart)
  
module.exports = router;