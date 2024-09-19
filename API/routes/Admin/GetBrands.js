var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/GetBrands')

router.get('/', controller.GetBrands)
  
module.exports = router;