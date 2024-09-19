var express = require('express');
var router = express.Router();
const utils=require('../../utils/middleware')

router.get('/', utils.validateToken)
  
module.exports = router;