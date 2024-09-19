var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/getCart')

router.get('/', controller.getCart)
  
module.exports = router;