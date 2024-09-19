var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/deleteInventory')

router.delete('/', controller.deleteInventory)
  
module.exports = router;