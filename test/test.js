"use strict";
/*global describe, it, before, beforeEach, after, afterEach */



var assert = require('assert');
var orm = require("orm");
var should = require('should');
var request = require('request');


describe('Routing', function () {
    describe('Users', function () {

        it('Should get the users', function (done) {
            request('http://127.0.0.1:8888/users', function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });
    });
});