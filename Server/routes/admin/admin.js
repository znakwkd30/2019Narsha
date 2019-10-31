const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const Controller = require('./admin.ctrl');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'admin');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    }
  }),
});

router.post('/userList', Controller.Ulist);
router.post('/userDelete', Controller.Udel);
router.patch('/productStateUpdate/:id', Controller.UpState);
router.get('/:id', Controller.one);
router.get('/searchProduct/:id', Controller.search);
router.get('/searchProductDetails/:id', Controller.searchDetail);
router.delete('/productDelete/:id', Controller.productDel);
router.get('/heartProductList', Controller.heartlist);
router.get('/reportList', Controller.reportList);
router.get('/hashtagList', Controller.hashList);
router.patch('/reportStateUp', Controller.UpState);

module.exports = router;