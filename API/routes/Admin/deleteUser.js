var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/deleteUser')

router.delete('/', controller.DeleteUser)
  
module.exports = router;