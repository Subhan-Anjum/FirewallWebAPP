var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/updateBrand')

router.post('/', controller.updateBrand)
  
module.exports = router;