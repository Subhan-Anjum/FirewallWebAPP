var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/changeStatus')

router.post('/', controller.UpdateStatus)
  
module.exports = router;