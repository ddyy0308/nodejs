/**
 * Created by yong.deng on 2016/10/9.
 */

'use strict';

var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var compression = require('compression');
var favicon = require('serve-favicon');
var log4js = require('log4js');

log4js.configure(path.join(__dirname, 'config/log4js.json'));
var log = log4js.getLogger("app");

var config = require('./config/config');

//assert.fail(app.get('env'), "production");
if(app.get('env') != 'production'){
    //export NODE_ENV=environment
    console.log('app is not production');
}

// set server configure
app.disable('x-powered-by');

// enable gizp by response header
app.use(compression());

//set favicon by client request
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));

/* static resource dir */
app.use('/static', express.static(path.join(__dirname, 'public'))); //static alias public
//app.use(express.static(path.join(__dirname, 'public')));

/* timeLog record */
//var logHandler = require('./middleware/logHandler');
//app.use(logHandler.timeLog);
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto', format:":remote-addr -- :method :url :status [length]:content-length [time]:response-time" }));

/* Access-Control-Allow-Origin * */
app.use('/api', cors());
app.use('/api/0.1', require('./routers/api'));
app.use('/api/stable', require('./routers/api-stable'));

app.use(function(req, res, next) {  // catch 404 and forward to error handler
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next){ // catch 500 error and handler
    next(err);
});

/* error handler */
app.use(function(err, req, res, next){
    log.error('[error Handler] %s', err.message);
    res.status(err.status).send(err.message);
});

/* start web server */
function startServer(){
    /* express server */
    var server = app.listen(config.app.port || 10086, function(){
        var host = server.address().address;
        var port = server.address().port;

        log.info('Application process [%d] listening at http://%s:%s', process.pid,  host, port);
    });
}

// main
if(require.main == module){
    startServer();
}else{
    module.exports = startServer;
}