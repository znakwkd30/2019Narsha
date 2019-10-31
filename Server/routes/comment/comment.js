const express = require('express');

const auth = require('../middleware');
const Controller = require('./comment.ctrl');

const router = express.Router();

router.post('/createComment/:id', auth, Controller.create);
router.get('/list/:id', auth, Controller.list);
router.delete('/deleteComment/:id', auth, Controller.delete);

module.exports = router;