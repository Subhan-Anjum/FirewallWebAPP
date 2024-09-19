var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/getProfile')

router.get('/', controller.getProfile)
  
module.exports = router;