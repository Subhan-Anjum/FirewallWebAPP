var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/getSupport')

router.get('/', controller.support)
  
module.exports = router;