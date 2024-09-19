var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/updateProfile')

router.post('/', controller.updateProfile)
  
module.exports = router;