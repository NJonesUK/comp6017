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

    describe('Correct Tests', function () {
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

    describe('Incorrect tests', function () {
        var userID = null;



        it('Should create a user', function (done) {
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

        it('Should fail to create a user because firstname is blank', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/users',
                form: {firstname: '', lastname: 'test', email: 'test@test.com', password: 'testing'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to create a user because lastname is blank', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/users',
                form: {firstname: 'lastname', lastname: '', email: 'test@test.com', password: 'testing'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to create a user because email is blank', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/users',
                form: {firstname: 'lastname', lastname: 'test', email: '', password: 'testing'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to create a user because email is not valid', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/users',
                form: {firstname: 'lastname', lastname: 'test', email: 'notAnEmail', password: 'testing'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to create a user because password is blank', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/users',
                form: {firstname: 'lastname', lastname: 'test', email: 'bbc@me.com', password: ''}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to  get the test user', function (done) {
            request('http://127.0.0.1:8888/users/' + (userID + 1), function (err, res) {
                if (!err) {

                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });


        it('Should fail to update a user because firstname is blank', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/users/' + userID,
                form: {firstname: '', lastname: 'test', email: 'test@test.com', password: 'testing'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to update a user because lastname is blank', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/users/' + userID,
                form: {firstname: 'lastname', lastname: '', email: 'test@test.com', password: 'testing'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to update a user because email is blank', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/users/' + userID,
                form: {firstname: 'lastname', lastname: 'test', email: '', password: 'testing'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to update a user because email is not valid', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/users/' + userID,
                form: {firstname: 'lastname', lastname: 'test', email: 'notAnEmail', password: 'testing'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to update a user because password is blank', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/users/' + userID,
                form: {firstname: 'lastname', lastname: 'test', email: 'bbc@me.com', password: ''}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
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

        it('Should fail to delete a test user', function (done) {
            request.del('http://127.0.0.1:8888/users/' + (userID - 1), function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });
    });
});












/*
QUESTION TESTS
*/
describe('Questions', function () {
    this.timeout(15000);

    describe('Correct Tests', function () {
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


        it('Should create a test question with title being 10 chars', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'thistitlei'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);

                    body.content.should.equal('testing question');
                    body.title.should.equal('thistitlei');
                    res.statusCode.should.equal(200);
                    request.del('http://127.0.0.1:8888/questions/' + body.id, function (err, res) {
                        if (!err) {
                            res.statusCode.should.equal(200);
                        }
                    });
                    done();
                }
            });
        });

        it('Should create a test question with content being 10 chars', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'thistitlei', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);

                    body.content.should.equal('thistitlei');
                    body.title.should.equal('ThisTitleIsBiggerThan10Chars');
                    res.statusCode.should.equal(200);
                    request.del('http://127.0.0.1:8888/questions/' + body.id, function (err, res) {
                        if (!err) {
                            res.statusCode.should.equal(200);
                        }
                    });
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

    describe('Incorrect Tests', function () {
        var questionID = null;

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


        it('Should fail to create a test question because title is blank', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: ''}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });

        it('Should fail to create a test question because title is less than 10 chars', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'title'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to create a test question because content is blank', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: '', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to create a test question because content is less than 10 chars', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'test', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to get the test question', function (done) {
            request('http://127.0.0.1:8888/questions/' + (questionID + 1), function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });


        it('Should fail to create a test question because title is blank', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/questions/' + questionID,
                form: {content: 'testing question', title: ''}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });

        it('Should fail to create a test question because title is less than 10 chars', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/questions/' + questionID,
                form: {content: 'testing question', title: 'title'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to create a test question because content is blank', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/questions/' + questionID,
                form: {content: '', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to create a test question because content is less than 10 chars', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/questions/' + questionID,
                form: {content: 'test', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });



        it('Should delete a test question', function (done) {
            request.del('http://127.0.0.1:8888/questions/' + (questionID - 1), function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
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
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'test answer', 'question_id': questionID}
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
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'hello worl', 'question_id': questionID}
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
		
		it('Should fail to create a test answer due to no question ID', function(done) {
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'test1234567890'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
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
            request('http://127.0.0.1:8888/answers/' + (answerID - 1), function (err, res) {
                if (!err) {

                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });


        it('Should fail to update a test answer due to no content', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.put({
                url: 'http://127.0.0.1:8888/answers/' + answerID,
                form: {content: '', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });

        it('Should fail to update a test answer due to less than 10 char content', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.put({
                url: 'http://127.0.0.1:8888/answers/' + answerID,
                form: {content: 'hello wor', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail trying to delete a test answer', function (done) {
            request.del('http://127.0.0.1:8888/answers/' + (answerID - 1), function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });

        it('Should fail trying to delete a test answer', function (done) {
            request.del('http://127.0.0.1:8888/answers/' + answerID, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });
    });
});


/*
	QUESTION COMMENT TESTS
*/
describe('Question comments', function () {
    this.timeout(15000);


    /*
        CORRECT TESTS
    */
    describe('Correct Tests', function () {
        var _commentID = null;
		var _questionID = null;
		
        it('Should get all the comments', function (done) {
            request('http://127.0.0.1:8888/questions/comments', function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });


        it('Should create a test comment', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
					_questionID = body.id;
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/questions/comments/',
                form: {content: 'test comment', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    _commentID =  body.id;

                    body.content.should.equal('test answer');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });



        it('Should create a test comment which is exactly 10 chars long and delete', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/questions/comments/',
                form: {content: 'hello worl', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    var body = JSON.parse(res.body);
                    request.del('http://127.0.0.1:8888/questions/' + questionID + '/'+ body.id, function (err, res) {
                        if (!err) {
                            res.statusCode.should.equal(200);
                        }
                    });
                    done();
                }
            });
        });

		
		
        it('Should get the test comment', function (done) {
            request('http://127.0.0.1:8888/questions/comments/'+ _questionID +'/' + _commentID, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);

                    body.content.should.equal('test comment');

                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });


        it('Should update the test comment', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/questions/comments/'+ _questionID +'/' + _commentID,
                form: {content: 'new test comment'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);

                    body.content.should.equal('new test comment');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });



        it('Should delete a test comment', function (done) {
            request.del('http://127.0.0.1:8888/questions/comments/'+ _questionID +'/' + _commentID, function (err, res) {
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
		var _questionID = null;
        var _commentID = null;

        it('Should create a test comment', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
					_questionID = body.id;
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/questions/comments/',
                form: {content: 'test comment', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    _commentID =  body.id;

                    body.content.should.equal('test comment');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });
		
		it('Should fail to create a test comment due to no question ID', function(done) {
            request.post({
                url: 'http://127.0.0.1:8888/questions/comments',
                form: {content: 'tes1234567890'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
                    done();
                }
            });
		});


        it('Should fail to create a test comment due to no content', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/questions/comments/'+ _questionID,
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
                url: 'http://127.0.0.1:8888/questions/comments/'+ _questionID,
                form: {content: 'hello wor'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to get the test comment', function (done) {
            request('http://127.0.0.1:8888/questions/comments/' + _questionID + '/' + (answerID + 51237), function (err, res) {
                if (!err) {

                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });


        it('Should fail to update a test comment due to no content', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.put({
                url: 'http://127.0.0.1:8888/questions/comments/' + questionID,
                form: {content: ''}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });

        it('Should fail to update a test comment due to less than 10 char content', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.put({
                 url: 'http://127.0.0.1:8888/questions/comments/' + questionID,
                form: {content: 'hello wor'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail trying to delete a test comment', function (done) {
            request.del('http://127.0.0.1:8888/questions/'+ _questionID +'/'+ (_commentID + 129714), function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });

        it('Should fail trying to delete a test comment', function (done) {
            request.del('http://127.0.0.1:8888/questions/'+ _questionID +'/'+ _commentID, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });
    });
});

/*
	ANSWER COMMENT TESTS
*/
describe('Answer comments', function () {
    this.timeout(15000);

    /*
        CORRECT TESTS
    */
    describe('Correct Tests', function () {
        var _commentID = null;
		var _questionID = null;
		var _answerID = null;
		
        it('Should get all the comments', function (done) {
            request('http://127.0.0.1:8888/answers/comments', function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });


        it('Should create a test comment', function (done) {
			var questionID = null;
			var answerID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
					_questionID = body.id;
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'test answer', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    answerID =  body.id;
					_answerID = body.id;

                    body.content.should.equal('test answer');
                    res.statusCode.should.equal(200);
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/answers/comments/'+ answerID,
                form: {content: 'test comment'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    _commentID =  body.id;

                    body.content.should.equal('test comment');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });



        it('Should create a test comment which is exactly 10 chars long and delete', function (done) {
			var questionID = null;
			var answerID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'test answer', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    answerID =  body.id;

                    body.content.should.equal('test answer');
                    res.statusCode.should.equal(200);
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/answers/comments/',
                form: {content: 'hello worl', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    var body = JSON.parse(res.body);
                    request.del('http://127.0.0.1:8888/questions/' + questionID + '/'+ body.id, function (err, res) {
                        if (!err) {
                            res.statusCode.should.equal(200);
                        }
                    });
                    done();
                }
            });
        });

		
		
        it('Should get the test comment', function (done) {
            request('http://127.0.0.1:8888/answers/comments/'+ _answerID +'/' + _commentID, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);

                    body.content.should.equal('test comment');

                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });


        it('Should update the test comment', function (done) {
            request.put({
                url: 'http://127.0.0.1:8888/answers/comments/'+ _answerID +'/' + _commentID,
                form: {content: 'new test comment'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);

                    body.content.should.equal('new test comment');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });



        it('Should delete a test comment', function (done) {
            request.del('http://127.0.0.1:8888/answers/comments/'+ _answerID +'/' + _commentID, function (err, res) {
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
        var _commentID = null;
		var _questionID = null;
		var _answerID = null;

        it('Should create a test comment', function (done) {
			var questionID = null;
			var answerID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
					_questionID = body.id;
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/answers',
                form: {content: 'test answer', 'question_id': questionID}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    answerID =  body.id;
					_answerID = body.id;

                    body.content.should.equal('test answer');
                    res.statusCode.should.equal(200);
                }
            });
			
            request.post({
                url: 'http://127.0.0.1:8888/answers/comments/'+ answerID,
                form: {content: 'test comment'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    _commentID =  body.id;

                    body.content.should.equal('test comment');
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });

        it('Should fail to create a test comment due to no content', function (done) {
            request.post({
                url: 'http://127.0.0.1:8888/answers/comments/'+ _answerID,
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
                url: 'http://127.0.0.1:8888/questions/comments/'+ _questionID,
                form: {content: 'hello wor'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail to get the test comment', function (done) {
            request('http://127.0.0.1:8888/questions/comments/' + _questionID + '/' + (answerID + 51237), function (err, res) {
                if (!err) {

                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });


        it('Should fail to update a test comment due to no content', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.put({
                url: 'http://127.0.0.1:8888/questions/comments/' + questionID,
                form: {content: ''}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });

        it('Should fail to update a test comment due to less than 10 char content', function (done) {
			var questionID = null;
			
            request.post({
                url: 'http://127.0.0.1:8888/questions',
                form: {content: 'testing question', title: 'ThisTitleIsBiggerThan10Chars'}
            }, function (err, res) {
                if (!err) {
                    var body = JSON.parse(res.body);
                    questionID = body.id;
                }
            });
			
            request.put({
                 url: 'http://127.0.0.1:8888/questions/comments/' + questionID,
                form: {content: 'hello wor'}
            }, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(400);
                    done();
                }
            });
        });


        it('Should fail trying to delete a test comment', function (done) {
            request.del('http://127.0.0.1:8888/questions/'+ _questionID +'/'+ (_commentID + 129714), function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(404);
                    done();
                }
            });
        });

        it('Should fail trying to delete a test comment', function (done) {
            request.del('http://127.0.0.1:8888/questions/'+ _questionID +'/'+ _commentID, function (err, res) {
                if (!err) {
                    res.statusCode.should.equal(200);
                    done();
                }
            });
        });
    });
});











