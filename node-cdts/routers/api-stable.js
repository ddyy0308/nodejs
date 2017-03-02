/**
 * Created by yong.deng on 2016/12/1.
 */

'use strict';

var express  = require('express');
var router = express.Router();
var _ = require('underscore');
var status = require('../util/status.js');
var model = require('../models/equipment').model;


var query = {'location.city':'成都市'};
var util = {
    // 查询字典映射
    queryDict:{
        'province':'location.province',
        'city':'location.city',
        'district':'location.district'
    },

    setQuery:function(key, value){
        // 清空上一次保持值
        query = {};
        if(key){
            key = util.queryDict[key] || key;
            query[key] = value;
        }
    }
};

/**
 * 所有请求需经过该函数进行处理
 */
router.use('/*/:area/:value', function(req, res, next){
    if(!req.params.area){
        res.send(status.setFail("param error!"));
    }

    util.setQuery(req.params.area, req.params.value);
    next();
});

/**
 *  获取设备风险评分
 *  [h 80-100 分, m 60-80, l 40-60, s 0-40]
 */
router.get('/riskGrade/:area/:value', function(req, res, next){
    res.send(status.setSuccess({level:'m', grade:'70'}));
});

/**
 *  获取设备总数
 */
router.get('/total/:area/:value', function(req, res, next){
    model.count(query, function(err, doc){
        if(err) res.send(status.setFail(err.name));
        res.send(status.setSuccess({total:doc, riskTotal:doc}));
    });
});

/**
 *  获取设备类型Top5
 */
router.get('/top5Type/:area/:value', function(req, res, next){
    var data = model.aggregate([
        {
            $match: query
        },{
            $group:{
                _id:'$type',
                value:{ $sum:1}
            }
        }
    ], function (err, data) {
        if(err) res.send(status.setFail(err.name));

        // FIXME: 去除含有最多数量的未知
        var dataArray =  _.sortBy(data, "value").reverse();
        var _data = _.filter(dataArray, function(obj){
            return obj['_id'] != "未知";
        });

        res.send(status.setSuccess(_data.splice(0,5)));
    });
});

/**
 *  获取城市=value的区县分布
 */
router.get('/distribution/:area/:value', function(req, res, next){
    var data = model.aggregate([
        {
            $match: query
        },{
            $group:{
                _id:'$location.district',
                value:{ $sum:1}
            }
        }
    ], function (err, data) {
        if(err) res.send(status.setFail(err.name));

        var dataArray =  _.sortBy(data, "value").reverse();
        var _data = _.filter(dataArray, function(obj){
            return obj['_id'] != "未知";
        });
        res.send(status.setSuccess(_data));
    });
});

/**
 *  获取Top5设备
 */
router.get('/top5Device/:area/:value', function(req, res, next){
    var filed = {_id:0, ip:1, type:1, 'location.city':1, 'location.district':1, 'leak':1};
    model.find(_.extend({leak:{$exists:1}},query ), filed).limit(5).exec(function(err, doc){
        if(err) res.send(status.setFail(err.name));
        res.send(status.setSuccess(doc));
    });
});

/**
 *  获取最新风险设备
 */
router.get('/recentlyDevice/:area/:value', function(req, res, next){
    var filed = {_id:0, ip:1, type:1, 'location.city':1, 'location.district':1};
    model.find(query, filed).sort({timestamp:-1}).exec(function(err, doc){
        if(err) res.send(status.setFail(err.name));
        res.send(status.setSuccess(doc));
    });
});

/**
 *  获取地图数据
 */
router.get('/map/:area/:value', function(req, res, next){
    var filed = {_id:0, ip:1, type:1, 'location.city':1, 'location.district':1, 'location.point':1, company:1, model:1, protocol:1,  leak:1};
    model.find(_.extend({'frequency':100}, query), filed).sort({timestamp:-1}).exec(function(err, doc){
        if(err) res.send(status.setFail(err.name));
        res.send(status.setSuccess(doc));
    });
});

module.exports = router;
