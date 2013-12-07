/* jslint node: true */
"use strict";

var util = require('util');
var express = require('express');
var orm = require('orm');
var expressValidator = require('express-validator');
var app = express();

app.use(express.bodyParser());
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!


// app.configure(function () {
//     app.use(expressValidator);
// });



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
        }
    }));

app.listen(8888);
console.log("Server running at http://127.0.0.1:8888/");





//GET - index all users 
app.get('/users', function (req, res) {
    // req.models.user.count(function (err, count) {
    //     if (!err) {
    //         console.log(count + ' users');
    //     }
    // });

    req.models.user.find(
        {},
        {},
        function (err, all_users) {

            if (!err) {
                res.writeHead(200, {"Content-Type": "application/json"});
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
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(user));
        } else {
            res.status(404).send('Not found');
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
    req.assert('firstname', 'First Name is a String').isString();

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
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.end(user);
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
    req.assert('firstname', 'First Name is a String').isString();

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
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(user_created));
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
    return req.models.user.find({id: req.params.user_id}).remove(function (err) {
        if (!err) {
            res.status(200).send("User destroyed");
        } else {
            res.status(404).send("Could not find user");
            console.log(err);
        }
    });
});





app.get("/test", function (res) {
    console.log("Hello World");
    res.send('Hello World');
});