var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/changeInventoryStatus')

router.post('/', controller.updateInventoryStatus)
  
module.exports = router;