var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/verify');

router.post('/', controller.Verify)
  
module.exports = router;