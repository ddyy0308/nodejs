/**
 * Created by yong.deng on 2016/12/1.
 */

'use strict';

var express  = require('express');
var router = express.Router();
var _ = require('underscore');
var status = require('../util/status.js');
var model = require('../models/equipment').model;


var query = {'location.city':'�ɶ���'};
var util = {
    // ��ѯ�ֵ�ӳ��
    queryDict:{
        'province':'location.province',
        'city':'location.city',
        'district':'location.district'
    },

    setQuery:function(key, value){
        // �����һ�α���ֵ
        query = {};
        if(key){
            key = util.queryDict[key] || key;
            query[key] = value;
        }
    }
};

/**
 * ���������辭���ú������д���
 */
router.use('/*/:area/:value', function(req, res, next){
    if(!req.params.area){
        res.send(status.setFail("param error!"));
    }

    util.setQuery(req.params.area, req.params.value);
    next();
});

/**
 *  ��ȡ�豸��������
 *  [h 80-100 ��, m 60-80, l 40-60, s 0-40]
 */
router.get('/riskGrade/:area/:value', function(req, res, next){
    res.send(status.setSuccess({level:'m', grade:'70'}));
});

/**
 *  ��ȡ�豸����
 */
router.get('/total/:area/:value', function(req, res, next){
    model.count(query, function(err, doc){
        if(err) res.send(status.setFail(err.name));
        res.send(status.setSuccess({total:doc, riskTotal:doc}));
    });
});

/**
 *  ��ȡ�豸����Top5
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

        // FIXME: ȥ���������������δ֪
        var dataArray =  _.sortBy(data, "value").reverse();
        var _data = _.filter(dataArray, function(obj){
            return obj['_id'] != "δ֪";
        });

        res.send(status.setSuccess(_data.splice(0,5)));
    });
});

/**
 *  ��ȡ����=value�����طֲ�
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
            return obj['_id'] != "δ֪";
        });
        res.send(status.setSuccess(_data));
    });
});

/**
 *  ��ȡTop5�豸
 */
router.get('/top5Device/:area/:value', function(req, res, next){
    var filed = {_id:0, ip:1, type:1, 'location.city':1, 'location.district':1, 'leak':1};
    model.find(_.extend({leak:{$exists:1}},query ), filed).limit(5).exec(function(err, doc){
        if(err) res.send(status.setFail(err.name));
        res.send(status.setSuccess(doc));
    });
});

/**
 *  ��ȡ���·����豸
 */
router.get('/recentlyDevice/:area/:value', function(req, res, next){
    var filed = {_id:0, ip:1, type:1, 'location.city':1, 'location.district':1};
    model.find(query, filed).sort({timestamp:-1}).exec(function(err, doc){
        if(err) res.send(status.setFail(err.name));
        res.send(status.setSuccess(doc));
    });
});

/**
 *  ��ȡ��ͼ����
 */
router.get('/map/:area/:value', function(req, res, next){
    var filed = {_id:0, ip:1, type:1, 'location.city':1, 'location.district':1, 'location.point':1, company:1, model:1, protocol:1,  leak:1};
    model.find(_.extend({'frequency':100}, query), filed).sort({timestamp:-1}).exec(function(err, doc){
        if(err) res.send(status.setFail(err.name));
        res.send(status.setSuccess(doc));
    });
});

module.exports = router;
