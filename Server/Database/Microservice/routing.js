const express = require('express');
const routing = express.Router();
routing.get('/', async (req, res, next) => {
    res.send(true)
})
module.exports = routing;