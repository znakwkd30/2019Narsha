const express = require('express');

const auth = require('../middleware');

const router = express.Router();

const Controller = require('./heart.ctrl');

router.post('/click/:id', auth, Controller.click); // /api/heart/click/1
router.post('/unclick/:id', auth, Controller.unClick); // /api/heart/unclick/1

module.exports = router;