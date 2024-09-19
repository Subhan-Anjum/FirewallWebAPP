var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/updateCredentials')

router.post('/', controller.updateCredentials)
  
module.exports = router;