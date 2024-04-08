const createError = require('http-errors');
const { v4: uuid } = require('uuid'); //tạo id định danh duy nhất => zalo node_express
const express = require('express');
const router = express.Router();

const logEvents = require('../helpers/logEvents');
const RouteV1 = require('./v1');
const indexController = require('../controllers/index.controller');
// const AuthController = require('../controllers/Auth.controller');

// router.use('/cookie', AuthController.verifyAccessToken, (req, res) => {
// res.clearCookie('refreshToken');
//     res.json({ cookies: req.cookies, signedCookies: req.signedCookies });
// });

// API
router.use('/api/v1', RouteV1);
//
// router.use('/', indexController.checkLogin, indexController.pageLogin);
router.use((req, res, next) => {
    next(createError.NotFound('This page does not exist'));
});

router.use((error, req, res, next) => {
    logEvents(`id: ${uuid()} - ${req.url} - ${req.method} - ${error.message}`);
    res.json({
        status: error.status || error.code || 500,
        message: error.message,
    });
});

module.exports = router;
