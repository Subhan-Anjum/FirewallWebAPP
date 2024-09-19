var express = require('express');
var router = express.Router();
const controller=require('../../controller/Users/frontendLogs')

router.post('/', controller.frontEndLogs)
  
module.exports = router;