var express = require('express');
var router = express.Router();
const multer = require("multer");
const controller=require('../../controller/Admin/updateInventory')
const storageConfig = require("../../utils/multer");

const upload = multer({ storage: storageConfig.storage });

router.post('/', upload.single("image"),controller.updateInventory)
  
module.exports = router;