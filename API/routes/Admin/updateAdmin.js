var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/updateAdmin')

router.post('/', controller.updateAdmin)
  
module.exports = router;