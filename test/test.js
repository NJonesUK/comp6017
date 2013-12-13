"use strict";
/*global describe, it, before, beforeEach, after, afterEach */



var assert = require('assert');
var orm = require("orm");
var should = require('should');
var request = require('request');



describe('Users', function () {
    this.timeout(15000);
    var userID = null;

    it('Should get the users', function (done) {
        request('http://127.0.0.1:8888/users', function (err, res) {
            if (!err) {
                res.statusCode.should.equal(200);
                done();
            }
        });
    });


    it('Should create a test user', function (done) {
        request.post({
            url: 'http://127.0.0.1:8888/users',
            form: {firstname: 'test', lastname: 'test', email: 'test@test.com', password: 'testing'}
        }, function (err, res) {
            if (!err) {
                var body = JSON.parse(res.body);
                userID =  body.id;

                body.firstname.should.equal('test');
                body.lastname.should.equal('test');
                body.email.should.equal('test@test.com');
                body.password.should.equal('testing');
                res.statusCode.should.equal(200);
                done();
            }
        });
    });


    it('Should get the test user', function (done) {
        request('http://127.0.0.1:8888/users/' + userID, function (err, res) {
            if (!err) {
                var body = JSON.parse(res.body);

                body.firstname.should.equal('test');
                body.lastname.should.equal('test');
                body.email.should.equal('test@test.com');
                body.password.should.equal('testing');
                res.statusCode.should.equal(200);
                done();
            }
        });
    });


    it('Should update the test user', function (done) {
        request.put({
            url: 'http://127.0.0.1:8888/users/' + userID,
            form: {firstname: 'newTest', lastname: 'newTest', email: 'newTest@newTest.com', password: 'newTesting'}
        }, function (err, res) {
            if (!err) {
                var body = JSON.parse(res.body);

                body.firstname.should.equal('newTest');
                body.lastname.should.equal('newTest');
                body.email.should.equal('newTest@newTest.com');
                body.password.should.equal('newTesting');
                res.statusCode.should.equal(200);
                done();
            }
        });
    });



    it('Should delete a test user', function (done) {
        request.del('http://127.0.0.1:8888/users/' + userID, function (err, res) {
            if (!err) {
                res.statusCode.should.equal(200);
                done();
            }
        });
    });
});
