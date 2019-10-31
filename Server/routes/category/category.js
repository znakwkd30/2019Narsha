const express = require('express');

const auth = require('../middleware');
const Controller = require('./category.ctrl');

const router = express.Router();

module.exports = router;