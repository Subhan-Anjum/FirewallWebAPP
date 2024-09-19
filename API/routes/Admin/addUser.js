var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/addUser');

router.post('/', controller.AddUser)
  
module.exports = router;