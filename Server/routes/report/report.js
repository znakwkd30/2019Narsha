const express = require('express');
const multer = require('multer');
const path = require('path');

const Controller = require('./report.ctrl');
const auth = require('../middleware');

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/reports');
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + new Date().valueOf() + ext);
      }
    }),
});

const router = express.Router();

router.post('/reportUser', auth, upload.array('file', 3), Controller.report); // /api/report/reportUser
router.patch('/updateReport/:id', auth, Controller.reportUp); // /api/report/modifyReprot
router.get('/myReportList', auth, Controller.list);
router.delete('/deleteReport/:id', auth, Controller.delete);

module.exports = router;