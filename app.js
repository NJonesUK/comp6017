/* node: true, devel: true, sloppy:true, unparam: true, nomen: true */

"use strict";

var util = require('util');
var express = require('express');
var orm = require('orm');
var expressValidator = require('express-validator');
var app = express();

app.use(express.bodyParser());
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!

app.use(orm.express("sqlite://test.db",
    {
        define: function (db, models, next) {
            db.load("./models", function (err) {
                //Can't get this way working, so i've declared it inline. 
                if (!err) {
                    console.log("not an error!");
                }
                next();
            });



            models.user = db.define("user",
                {
                    firstname : String,
                    lastname  : String,
                    email     : String,
                    password  : String, //bcrypt hashes, need to write a function in here somewhere to manage that, nick to sort

                }, {
                    methods: {
                        fullName: function () {
                            return this.firstname + ' ' + this.lastname;
                        }
                    },
                });

            models.question = db.define("question",
                {
                    date_posted : Date,
                    content     : String,
                    title       : String,
                }, {
                });

            db.models.question.hasOne("owner", db.models.user, { reverse: 'questions' });

            models.answer = db.define("answer",
                {
                    content : String,
                    date_posted : Date,
                }, {
                });

        }
    }));

app.listen(8888);
console.log("Server running at http://127.0.0.1:8888/");








/*

USER CODE

*/

//GET - index all users 
app.get('/users', function (req, res) {
    req.models.user.find(
        {},
        {},
        function (err, all_users) {

            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(all_users));
            } else {
                res.status(400).send("Not found");
            }
        }
    );
});

//GET - show individual User
app.get('/users/:user_id', function (req, res) {
    req.models.user.get(req.params.user_id, function (err, user) {
        if (!err) {
            // console.log(user.fullName());
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        } else {
            res.status(404).send('Not found');
        }
    });
});

app.get('/users/:user_id/questions', function (req, res) {
    req.models.user.get(req.params.user_id, function (err, user) {
        if (!err) {
            //for a single user, list his questions.

            console.log(JSON.stringify(user));
            // console.log(user.getChild());
            // req.models.questions.getParent(user, function (err, results) {
            //     if (!err) {
            //         console.log(results);
            //     } else {
            //         res.status(404).send(err);
            //     }
            // });
        } else {
            res.status(404).send(err);
        }
    });
});


//PUT updates user
app.put('/users/:user_id', function (req, res) {


    req.assert('firstname', 'A First Name is required').notEmpty();
    req.assert('lastname', 'A Last Name is required').notEmpty();
    req.assert('email', 'An email address is required').notEmpty();
    req.assert('email', 'A valid email address is required').isEmail();
    req.assert('password', 'A password is required').notEmpty();

    var errors = req.validationErrors();

    if (!errors) {
        req.models.user.get(req.params.user_id, function (err, user) {
            if (!err) {
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                user.email = req.body.email;
                user.password = req.body.password;

                user.save(function (err) {
                    if (!err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(user));
                    } else {
                        //Assume it's because of bad syntax, could we try catch for specific errors?
                        res.status(400).send("Could not update user");
                    }
                });
            } else {
                res.status(404).send("User was not found");
            }
        });
    } else {
        res.status(400).send("Bad Syntax" + errors);
    }

});


//POST - create new user
app.post("/users", function (req, res) {

    req.assert('firstname', 'A First Name is required').notEmpty();
    req.assert('lastname', 'A Last Name is required').notEmpty();
    req.assert('email', 'An email address is required').notEmpty();
    req.assert('email', 'A valid email address is required').isEmail();
    req.assert('password', 'A password is required').notEmpty();

    var errors = req.validationErrors();
    if (!errors) {
        req.models.user.create(
            [{
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            }, ],

            function (err, user_created) {
                if (!err) {
                    var user = user_created[0];
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(user));
                } else {
                    res.status(500).send(err);
                }
            }
        );
    } else {
        res.status(400).send("Bad syntax " + errors);
    }

});

//DELETE - destroy User
app.delete('/users/:user_id', function (req, res) {
    req.models.user.find({id: req.params.user_id}).remove(function (err) {
        if (!err) {
            res.status(200).send("User destroyed");
        } else {
            res.status(404).send("Could not find user");
            console.log(err);
        }
    });
});





/*

QUESTION CODE

*/


//GET - index all questions 
app.get('/questions', function (req, res) {
    req.models.question.find(
        {},
        {},
        function (err, all_questions) {
            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(all_questions));
            } else {
                res.status(400).send(err);
            }
        }
    );
});


//GET - show individual question
app.get('/questions/:question_id', function (req, res) {
    req.models.question.get(req.params.question_id, function (err, question) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(question));
        } else {
            res.status(404).send('Not found');
        }
    });
});


//PUT updates question
app.put('/questions/:question_id', function (req, res) {

    req.assert('content', 'Content is required').notEmpty();
    req.assert('content', 'Content has to be between 10 and 600 chars').len(10, 600);
    req.assert('title', 'Title is required').notEmpty();
    req.assert('title', 'Tile has to be between 10 and 50 chars').len(10, 50);

    var errors = req.validationErrors();

    if (!errors) {
        req.models.question.get(req.params.question_id, function (err, question) {
            if (!err) {

                //only update the title and content
                question.title = req.body.title;
                question.content = req.body.content;

                question.save(function (err) {
                    if (!err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(question));
                    } else {
                        //Assume it's because of bad syntax, could we try catch for specific errors?
                        res.status(400).send("Could not update question");
                    }
                });
            } else {
                res.status(404).send("question was not found");
            }
        });
    } else {
        res.status(400).send("Bad Syntax" + errors);
    }

});


//POST - create new question
app.post("/questions", function (req, res) {

    req.assert('content', 'Content is required').notEmpty();
    req.assert('content', 'Content has to be between 10 and 600 chars').len(10, 600);
    req.assert('title', 'Title is required').notEmpty();
    req.assert('title', 'Tile has to be between 10 and 50 chars').len(10, 50);

    var datetime = new Date(),
        errors = req.validationErrors();

    if (!errors) {
        req.models.question.create(
            [{
                date_posted: datetime,
                title: req.body.title,
                content: req.body.content,
                owner_id: 2
            }, ],
            function (err, question_created) {
                if (!err) {
                    var question = question_created[0];
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(question));
                } else {
                    res.status(500).send(err);
                }
            }
        );
    } else {
        res.status(400).send(errors);
    }

});



//DELETE - destroy Question
app.delete('/questions/:question_id', function (req, res) {
    req.models.question.find({id: req.params.question_id}).remove(function (err) {
        if (!err) {
            res.status(200).send("Question destroyed");
        } else {
            res.status(404).send("Could not find user");
        }
    });
});


/*

ANSWER CODE

*/

//GET - index all answers 
app.get('/answers', function (req, res) {
    req.models.answer.find(
        {},
        {},
        function (err, all_answers) {
            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(all_answers));
            } else {
                res.status(400).send(err);
            }
        }
    );
});


//GET - show individual answer
app.get('/answers/:answer_id', function (req, res) {
    req.models.answer.get(req.params.answer_id, function (err, answer) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(answer));
        } else {
            res.status(404).send('Not found');
        }
    });
});


//PUT updates answer
app.put('/answers/:answer_id', function (req, res) {

    req.assert('content', 'Content is required').notEmpty();
    req.assert('content', 'Content has to be between 10 and 600 chars').len(10, 600);
    // req.assert('title', 'Title is required').notEmpty();
    // req.assert('title', 'Tile has to be between 10 and 50 chars').len(10, 50);

    var errors = req.validationErrors();

    if (!errors) {
        req.models.answer.get(req.params.answer_id, function (err, answer) {
            if (!err) {

                //only update the title and content
                answer.content = req.body.content;

                answer.save(function (err) {
                    if (!err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(answer));
                    } else {
                        //Assume it's because of bad syntax, could we try catch for specific errors?
                        res.status(400).send("Could not update answer");
                    }
                });
            } else {
                res.status(404).send("answer was not found");
            }
        });
    } else {
        res.status(400).send(errors);
    }

});


//POST - create new answer
app.post("/answers", function (req, res) {

    req.assert('content', 'Content is required').notEmpty();
    req.assert('content', 'Content has to be between 10 and 600 chars').len(10, 600);

    var datetime = new Date(),
        errors = req.validationErrors();

    if (!errors) {
        req.models.answer.create(
            [{
                date_posted: datetime,
                content: req.body.content,
                owner_id: null,
                question_id: null
            }, ],
            function (err, answer_created) {
                if (!err) {
                    var answer = answer_created[0];
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(answer));
                } else {
                    res.status(500).send(err);
                }
            }
        );
    } else {
        res.status(400).send(errors);
    }

});



//DELETE - destroy Answer
app.delete('/answers/:answer_id', function (req, res) {
    req.models.answer.find({id: req.params.answer_id}).remove(function (err) {
        if (!err) {
            res.status(200).send("Answer destroyed");
        } else {
            res.status(404).send("Could not find user");
        }
    });
});



/*

TEST CODE

*/




app.get("/test", function (res) {
    console.log("Hello World");
    res.send('Hello World');
});