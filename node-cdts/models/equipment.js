/**
 * Created by yong.deng on 2016/10/9.
 */

var dbCfg = require('../config/config').db;
var util = require('util');
var mongoose = require('mongoose');
var log4js = require('log4js');
var log = log4js.getLogger("app");

mongoose.Promise = require('bluebird');
/* ���ݿ����� */
mongoose.connect(util.format("mongodb://%s:%s@%s/icssa_cd", dbCfg.user, dbCfg.password, dbCfg.host), {auth:{authdb:"admin"}});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    log.info('Connection db success')
});
db.on('disconnected', function (callback) {
    log.info('Connection db disconnected')
});

/* �����ı����Ժͷ��� */
var equipmentSchema = new mongoose.Schema({
    'ip':String,
    'location.city':String,
    'type':String,
    'timestamp':String
});

/*
equipmentSchema.methods.count = function(query, cb){
    return this.model('equipment').find(query, cb);
};

equipmentSchema.methods.distinct = function(filed, query, cb){
    return this.model('equipment').distinct(filed, query, cb);
};
*/

/* ����ģ�� -��equipment���ݿ����*/
var equipmentModel = mongoose.model('equipment', equipmentSchema);
exports.model = equipmentModel;