var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/register');

router.post('/', controller.Register)
  
module.exports = router;