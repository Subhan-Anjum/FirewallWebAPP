var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/getUsers')

router.get('/', controller.GetUsers)
  
module.exports = router;