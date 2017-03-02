/**
 * Created by yong.deng on 2016/10/9.
 */

'use strict';

var log4js = require('log4js');
var log = log4js.getLogger("app");
/**
 * Module exports.
 */
var _log = {};
module.exports = log;

/**
 * Record http request time-ip-method-url.
 */
log.timeLog = function(req, res, next){
    var date = new Date();
    log.info('[%s]-[%s] %s %s', date.toLocaleString() , req.ip, req.method, req.originalUrl);
    next();
};

/**
 * Error Handler.
 */
log.errorHandler = function(err, req, res, next){
    log.error('[errorHandler] %s', err.message);
    res.status(err.status).send(err.message);
};
