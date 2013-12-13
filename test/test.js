"use strict";
/*global describe, it, before, beforeEach, after, afterEach */



var assert = require('assert');
var orm = require("orm");
var should = require('should');
var request = require('request');


/*
USER TESTS
*/

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




/*
QUESTION TESTS
*/
describe('Questions', function () {
    this.timeout(15000);
    var questionID = null;

    it('Should get the questions', function (done) {
        request('http://127.0.0.1:8888/questions', function (err, res) {
            if (!err) {
                res.statusCode.should.equal(200);
                done();
            }
        });
    });


    it('Should create a test question', function (done) {
        request.post({
            url: 'http://127.0.0.1:8888/questions',
            form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
        }, function (err, res) {
            if (!err) {
                var body = JSON.parse(res.body);
                questionID =  body.id;

                body.content.should.equal('testing question');
                body.title.should.equal('ThisTitleIsBiggerThan10Chars');
                res.statusCode.should.equal(200);
                done();
            }
        });
    });


    it('Should get the test question', function (done) {
        request('http://127.0.0.1:8888/questions/' + questionID, function (err, res) {
            if (!err) {
                var body = JSON.parse(res.body);

                body.content.should.equal('testing question');
                body.title.should.equal('ThisTitleIsBiggerThan10Chars');
                res.statusCode.should.equal(200);
                done();
            }
        });
    });


    it('Should update the test question', function (done) {
        request.put({
            url: 'http://127.0.0.1:8888/questions/' + questionID,
            form: {content: 'new testing question', title: 'new ThisTitleIsBiggerThan10Chars'}
        }, function (err, res) {
            if (!err) {
                var body = JSON.parse(res.body);

                body.content.should.equal('new testing question');
                body.title.should.equal('new ThisTitleIsBiggerThan10Chars');
                res.statusCode.should.equal(200);
                done();
            }
        });
    });



    it('Should delete a test question', function (done) {
        request.del('http://127.0.0.1:8888/questions/' + questionID, function (err, res) {
            if (!err) {
                res.statusCode.should.equal(200);
                done();
            }
        });
    });
});







/*
    ANSWER TESTS
*/
describe('Answers', function () {
    this.timeout(15000);


    /*
        CORRECT TESTS
    */
    describe('Correct Tests', function () {
        var answerID = null;
        it('Should get the answers', function (done) {
            request('http://127.0.0.1:8888/answers', function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });


        it('Should create a test answer', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'test answer'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    answerID =  body.id;

                    body.content.should.equal('test answer');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });



        it('Should create a test answer which is exactly 10 chars long', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'hello worl'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    var body = JSON.parse(res.body);
                    request.del('http://127.0.0.1:8888/answers/' + body.id, function (err, res) {
                        if (!err) {
                            res.statusCode.should.equal(200);
                        }
                    });
                    done();
                }
            });
        });



        it('Should get the test answer', function (done) {
            request('http://127.0.0.1:8888/answers/' + answerID, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);

                    body.content.should.equal('test answer');

                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });


        it('Should update the test answer', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/answers/' + answerID,
                form: {content: 'new test answer'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);

                    body.content.should.equal('new test answer');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });



        it('Should delete a test answer', function (done) {
            request.del('http://127.0.0.1:8888/answers/' + answerID, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });
    });


    /*
        INCORRECT TESTS
    */
    describe('Incorrect Tests', function () {
        var answerID = null;


        it('Should create a test answer', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'test answer'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    answerID =  body.id;

                    body.content.should.equal('test answer');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });


        it('Should fail to create a test answer due to no content', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: ''}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });

        it('Should fail to create a test answer due to less than 10 char content', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'hello wor'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to get the test answer', function (done) {
            request('http://127.0.0.1:8888/answers/' + (answerID-1), function (err, res) {
                if (!err) {

                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });


        it('Should fail to update a test answer due to no content', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/answers/' + answerID,
                form: {content: ''}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });

        it('Should fail to update a test answer due to less than 10 char content', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/answers/' + answerID,
                form: {content: 'hello wor'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });




        it('Should delete a test answer', function (done) {
            request.del('http://127.0.0.1:8888/answers/' + (answerID-1), function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });
    });
});












