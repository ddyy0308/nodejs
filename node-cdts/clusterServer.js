/**
 * Created by yong.deng on 2016/10/14.
 */

var cluster = require('cluster');
var log4js = require('log4js');
var log = log4js.getLogger("cluster");

/* ����һ���ӽ��� */
function startWork(){
    var worker = cluster.fork();
    log.info('CLUSTER: Worker %d started', worker.id);
}

if(cluster.isMaster){   // ������
    var n = require('./config/config').cluster.worker || require('os').cpus().length;
    for(var i = 0; i < n; i++){
        startWork();
    }

    // �����ӽ����˳�ʱ��������һ���µ��ӽ���
    cluster.on('exit', function(worker, code, signal){
        log.debug("CLUSTER: Worker %d died with exit code %d (%s)", worker.id, code, signal);
        startWork();
    });
}else{  // �ӽ���
    var startServer = require("./app");
    startServer();
}