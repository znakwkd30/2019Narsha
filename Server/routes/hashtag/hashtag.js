const express = require('express');

const auth = require('../middleware');
const Controller = require('./hashtag.ctrl');

const router = express.Router();

router.get('/hashtagList', auth, Controller.tagList);
router.get('/searchTag', auth, Controller.tagSearch);

module.exports = router;