/**
 * Created by yong.deng on 2016/10/14.
 */

var cluster = require('cluster');
var log4js = require('log4js');
var log = log4js.getLogger("cluster");

/* 启动一个子进程 */
function startWork(){
    var worker = cluster.fork();
    log.info('CLUSTER: Worker %d started', worker.id);
}

if(cluster.isMaster){   // 父进程
    var n = require('./config/config').cluster.worker || require('os').cpus().length;
    for(var i = 0; i < n; i++){
        startWork();
    }

    // 监听子进程退出时，再启动一个新的子进程
    cluster.on('exit', function(worker, code, signal){
        log.debug("CLUSTER: Worker %d died with exit code %d (%s)", worker.id, code, signal);
        startWork();
    });
}else{  // 子进程
    var startServer = require("./app");
    startServer();
}