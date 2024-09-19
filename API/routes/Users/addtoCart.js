var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/addtoCart')

router.post('/', controller.addtoCart)
  
module.exports = router;