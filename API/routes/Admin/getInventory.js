var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/getInventory')

router.get('/', controller.GetInventory)
  
module.exports = router;