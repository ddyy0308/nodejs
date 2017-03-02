/**
 * Created by admin on 2016/10/13.
 */
var should = require('should');
var express = require('express');
var request = require('supertest');

var config = require('../config/config');

describe("[成都综合态势感知平台-工控]restfull api 接口测试 ", function(){
    var app = express();
    app.get('/total/city/cd', function(req, res) {
        res.status(200).json({ name: 'tobi' });
    });
    var url = 'http://127.0.0.1:'+config.app.port+  '/api/0.1';

    it("获取设备总数- GET /total/city/cd", function(done){
        request(url).get('/total/city/cd')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var obj  = JSON.parse(res.text);
                should.not.exist(err);
                obj.status.should.be.equal(0);
                obj.data.should.have.keys('total', 'riskTotal');
                done();
            });
    });

    it("获取设备风险评分- GET /riskGrade/city/cd", function(done){
        request(url).get('/riskGrade/city/cd')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var obj  = JSON.parse(res.text);
                should.not.exist(err);
                obj.status.should.be.equal(0);
                obj.data.should.have.keys('level', 'grade');
                done();
            });
    });

    it("获取排名前五设备类型- GET /top5Type/city/cd", function(done){
        request(url).get('/top5Type/city/cd')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var obj  = JSON.parse(res.text);
                should.not.exist(err);
                obj.status.should.be.equal(0);
                obj.data.should.Array();
                if(obj.data.length > 0)
                    obj.data[0].should.have.keys('_id', 'value');
                done();
            });
    });

    it("获取城市区县分布- GET /distribution/city/cd", function(done){
        request(url).get('/distribution/city/cd')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var obj  = JSON.parse(res.text);
                should.not.exist(err);
                obj.status.should.be.equal(0);
                obj.data.should.Array();
                if(obj.data.length > 0)
                    obj.data[0].should.have.keys('_id', 'value');
                done();
            });
    });

    it("获取排名前五设备- GET /top5Device/city/cd", function(done){
        request(url).get('/top5Device/city/cd')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var obj  = JSON.parse(res.text);
                should.not.exist(err);
                obj.status.should.be.equal(0);
                obj.data.should.Array();
                if(obj.data.length > 0)
                    obj.data[0].should.have.keys('ip', 'type', 'leak', 'location');
                done();
            });
    });

    it("获取最新风险设备- GET /recentlyDevice/city/cd", function(done){
        request(url).get('/recentlyDevice/city/cd')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var obj  = JSON.parse(res.text);
                should.not.exist(err);
                obj.status.should.be.equal(0);
                obj.data.should.Array();
                if(obj.data.length > 0)
                    obj.data[0].should.have.keys('ip', 'type', 'timestamp', 'location');
                done();
            });
    });

    it("获取2D地图展示数据- GET /map/city/cd", function(done){
        request(url).get('/map/city/cd')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var obj  = JSON.parse(res.text);
                should.not.exist(err);
                obj.status.should.be.equal(0);
                obj.data.should.Array();
                if(obj.data.length > 0)
                    obj.data[0].should.have.keys('ip', 'type', 'timestamp', 'location', 'leak', 'company');
                done();
            });
    });
});