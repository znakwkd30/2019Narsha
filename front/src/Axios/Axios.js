const axios = require('axios');
const dbUri = require('../config/dbUri');

module.exports = axios.create({
    baseURL: dbUri.baseUri,
    timeout: 1000,
})