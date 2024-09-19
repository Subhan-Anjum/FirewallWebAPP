var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/getDashboard')

router.get('/', controller.GetDashboard)
  
module.exports = router;