var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/updateUser')

router.post('/', controller.UpdateUser)
  
module.exports = router;