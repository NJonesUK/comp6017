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

			models.comments_question = db.define("comments_question",
				{
					content : String,
					date_posted : Date
				},{	
				});

			db.models.comments_question.hasOne("owner", db.models.user, { reverse: 'comments_question' });
			db.models.comments_question.hasOne("question", db.models.question, { reverse: 'comments' });

			models.comments_answer = db.define("comments_answer",
				{
					content : String,
					date_posted : Date 
				}, {	
				});
				
			db.models.comments_answer.hasOne("owner", db.models.user, { reverse: 'comments_answer' });
			db.models.comments_answer.hasOne("answer", db.models.answer, { reverse: 'comments' });
        }
    }));
	
/*

AUTHENTICATION CODE

*/

function verifyUser (user, password) {
	if (password == user.password)
	{
		var result = true;
	}
	else
	{
		var result = false;
	}
}

app.listen(8888);
//console.log("verifyuser: " + verifyUser(2, "test"));
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
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        } else {
            res.status(404).send('Not found');
        }
    });
});

//GET - get all of a given user's questions
app.get('/users/:user_id/questions', function (req, res) {
    req.models.user.get(req.params.user_id, function (err, user) {
        if (!err) {
            //for a single user, list his questions.

            // console.log(JSON.stringify(user));
            // console.log(user.getChild());
            req.models.question.findByOwner(user, function (err, results) {
                if (!err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                } else {
                    res.status(404).send(err);
                }
            });
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
    req.models.user.get(req.params.user_id, function (err, user) {
        if (!err) {
            user.remove(function (err) {
                if (!err) {
                    res.status(200).send("User destroyed");
                } else {
                    res.status(500).send("Server Error");
                }
            });
        } else {
            res.status(404).send("not found");
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
    req.models.question.get(req.params.question_id, function (err, question) {
        if (!err) {
            question.remove(function (err) {
                if (!err) {
                    res.status(200).send("Question destroyed");
                } else {
                    res.status(500).send("Server Error");
                }
            });
        } else {
            res.status(404).send("not found");
        }
    });
});

/*

QUESTION COMMENT CODE

*/

app.get('/questions/comments', function (req, res) {
    req.models.question_comments.find(
        {},
        {},
        function (err, all_question_comments) {
            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(all_question_comments));
            } else {
                res.status(400).send(err);
            }
        }
    );
});

app.get('/questions/comments/:question_id', function (req, res) {
	// this gets the question, and then we need to get the comments from that.
    req.models.question.get(req.params.question_id, function (err, question) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
			
			// we have the question.
			question.getComments(function(err, comments) {
				if(!err) {
					res.end(JSON.stringify(comments))
				} else {
					res.status(404).send('Comment not found');
				}
			});
        } else {
            res.status(404).send('Comment not found');
        }
    });
});

app.get('/questions/comments/:question_id/:comment_id', function (req, res) {
	// this gets the question, and then we need to get the comments from that.
    req.models.comments_question.get(req.params.comment_id, function (err, comment) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
			
			// we have the answer, verify this is from the right question
			comment.getOwner(function(err, owner) {
				if(!err) {
		            res.end(JSON.stringify(comment));
				}
				else {
					res.status(404).send('Comment not found');
				}
			});
			
        } else {
            res.status(404).send('Comment not found');
        }
    });
});

// PUT - update question comment
app.put('/questions/comments/:question_id/:comment_id', function (req, res) {

    req.assert('content', 'Content is required').notEmpty();
    req.assert('content', 'Content has to be between 10 and 600 chars').len(10, 600);

    var errors = req.validationErrors();

    if (!errors) {
        req.models.comments_question.get(req.params.comment_id, function (err, comment) {
            if (!err) {
				
				// verify this comment belongs to the question
				if(comment.id == req.params.question_id) {

					// update the content
	                comment.content = req.body.content;
					
	                comment.save(function (err) {
	                    if (!err) {
	                        res.setHeader('Content-Type', 'application/json');
	                        res.end(JSON.stringify(comment));
	                    } else {
	                        //Assume it's because of bad syntax, could we try catch for specific errors?
	                        res.status(400).send("Could not update comment");
	                    }
	                });
				} else {
					res.status(404).send("Comment with this question id was not found");
				}
            } else {
                res.status(404).send("Comment was not found");
            }
        });
    } else {
        res.status(400).send("Bad Syntax" + errors);
    }
});

//POST - create new question comment
app.post("/questions/comments/:question_id", function (req, res) {

    req.assert('content', 'Content is required').notEmpty();
    req.assert('content', 'Content has to be between 10 and 600 chars').len(10, 600);

    var datetime = new Date(),
        errors = req.validationErrors();

    if (!errors) {
		req.models.questions.get(req.params.question_id, function(err, question) {
			// if there is no error, this question exists. so we can add a new answer
			// to this question
			if(!err) {
				req.models.comments_question.create(
					[{
						date_posted: datetime,
						content: req.body.content,
						question_id: question.id
					}], 
					function (err, comment_created) {
						if(!err) {
		                    var comment = comment_created[0];
		                    res.setHeader('Content-Type', 'application/json');
		                    res.end(JSON.stringify(comment));
						} else {
							res.status(500).send(err);
						}
					}
				);
			} else {
				res.status(400).send(errors);
			}
		});
    } else {
        res.status(400).send(errors);
    }
});

//DELETE - destroy comment
app.delete('/questions/:question_id/:comment_id', function (req, res) {
    req.models.comments_question.get(req.params.comment_id, function (err, comment) {
        if (!err) {
            comment.remove(function (err) {
                if (!err) {
                    res.status(200).send("Comment destroyed");
                } else {
                    res.status(500).send("Server Error");
                }
            });
        } else {
            res.status(404).send("not found");
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
    req.models.answer.get(req.params.answer_id, function (err, answer) {
        if (!err) {
            answer.remove(function (err) {
                if (!err) {
                    res.status(200).send("Answer destroyed");
                } else {
                    res.status(500).send("Server Error");
                }
            });
        } else {
            res.status(404).send("not found");
        }
    });
});

/*

comments for answers

*/

app.get('/answers/comments', function (req, res) {
    req.models.comments_answer.find(
        {},
        {},
        function (err, all_answer_comments) {
            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(all_answer_comments));
            } else {
                res.status(400).send(err);
            }
        }
    );
});

app.get('/answers/comments/:answer_id', function (req, res) {
	// this gets the question, and then we need to get the comments from that.
    req.models.answer.get(req.params.answer_id, function (err, answer) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
			
			// we have the question.
			answer.getComments(function(err, comments) {
				if(!err) {
					res.end(JSON.stringify(comments))
				} else {
					res.status(404).send('Comment not found');
				}
			});
        } else {
            res.status(404).send('Comment not found');
        }
    });
});

app.get('/answers/comments/:answer_id/:comment_id', function (req, res) {
	// this gets the question, and then we need to get the comments from that.
    req.models.comments_answer.get(req.params.comment_id, function (err, comment) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
			
			// we have the answer, verify this is from the right question
			comment.getOwner(function(err, owner) {
				if(!err) {
		            res.end(JSON.stringify(comment));
				}
				else {
					res.status(404).send('Comment not found');
				}
			});
			
        } else {
            res.status(404).send('Comment not found');
        }
    });
});

// PUT - update question comment
app.put('/answers/comments/:answer_id/:comment_id', function (req, res) {

    req.assert('content', 'Content is required').notEmpty();
    req.assert('content', 'Content has to be between 10 and 600 chars').len(10, 600);

    var errors = req.validationErrors();

    if (!errors) {
        req.models.comments_answer.get(req.params.comment_id, function (err, comment) {
            if (!err) {
				
				// verify this comment belongs to the question
				if(comment.id == req.params.answer_id) {

					// update the content
	                comment.content = req.body.content;
					
	                comment.save(function (err) {
	                    if (!err) {
	                        res.setHeader('Content-Type', 'application/json');
	                        res.end(JSON.stringify(comment));
	                    } else {
	                        //Assume it's because of bad syntax, could we try catch for specific errors?
	                        res.status(400).send("Could not update comment");
	                    }
	                });
				} else {
					res.status(404).send("Comment with this answer id was not found");
				}
            } else {
                res.status(404).send("Comment was not found");
            }
        });
    } else {
        res.status(400).send("Bad Syntax" + errors);
    }
});

//POST - create new question comment
app.post("/answers/comments/:answer_id", function (req, res) {

    req.assert('content', 'Content is required').notEmpty();
    req.assert('content', 'Content has to be between 10 and 600 chars').len(10, 600);

    var datetime = new Date(),
        errors = req.validationErrors();

    if (!errors) {
		req.models.answer.get(req.params.answer_id, function(err, answer) {
			// if there is no error, this question exists. so we can add a new answer
			// to this question
			if(!err) {
				req.models.comments_answer.create(
					[{
						date_posted: datetime,
						content: req.body.content,
						answer_id: answer.id
					}], 
					function (err, comment_created) {
						if(!err) {
		                    var comment = comment_created[0];
		                    res.setHeader('Content-Type', 'application/json');
		                    res.end(JSON.stringify(comment));
						} else {
							res.status(500).send(err);
						}
					}
				);
			} else {
				res.status(400).send(errors);
			}
		});
    } else {
        res.status(400).send(errors);
    }
});

//DELETE - destroy comment
app.delete('/answers/comments/:answer_id/:comment_id', function (req, res) {
    req.models.comments_answer.get(req.params.comment_id, function (err, comment) {
        if (!err) {
            comment.remove(function (err) {
                if (!err) {
                    res.status(200).send("Comment destroyed");
                } else {
                    res.status(500).send("Server Error");
                }
            });
        } else {
            res.status(404).send("not found");
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