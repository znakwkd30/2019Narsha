const express = require('express');
const multer = require('multer');
const path = require('path');

const auth = require('../middleware');
const Controller = require('./product.ctrl');

const router = express.Router();
router.use(express.static(__dirname + '/uploads'));

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/uploads');
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + new Date().valueOf() + ext);
      }
    }),
});

router.post('/upload', upload.single('file'), (req, res) => { // /api/product/upload
    console.log(req.file);
});

router.post('/', auth, upload.array('image', 3), Controller.productRegister); // /api/product/
router.patch('/updateProduct/:id', auth, upload.array('image', 3), Controller.productUp); // /api/product/updateProduct/1
router.delete('/deleteProduct/:id', auth, Controller.productDel); // /api/product/deleteProduct/1
router.get('/main', Controller.mainProduct); // /api/product/main
router.get('/all', auth, Controller.allProduct); // /api/product/all
router.get('/detail/:id', auth, Controller.details);
router.get('/myProduct', auth, Controller.myProduct); // /api/product/myProduct
router.get('/hashtagProduct/:hashtag', auth, Controller.hashProduct); // /api/product/hashtagProduct
router.get('/searchProduct/:name', auth, Controller.productSearch); // /api/product/searchProduct/123
router.get('/heartProductList', auth, Controller.heartProduct); // /api/product/heartProduct/gwak
router.get('/categoryProduct/:category', auth, Controller.categoryList);
router.get('/middle', auth, Controller.middle);
router.get('/final', auth, Controller.final);
router.get('/sellerProduct/:id', auth, Controller.sellerProduct)

module.exports = router;