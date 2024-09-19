var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/support');

router.post('/', controller.Support)
  
module.exports = router;