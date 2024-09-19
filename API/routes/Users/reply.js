var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/reply');

router.post('/', controller.reply)
  
module.exports = router;