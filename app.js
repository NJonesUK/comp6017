var express = require('express');
var orm = require('orm');
var app = express();
app.use(express.bodyParser());

app.use(orm.express("sqlite://test.db", 
{
    define: function (db, models, next) 
    {
    	db.load("./models", function (err) {


            //Can't get this way working, so i've declared it inline. 

		    // loaded!
		    // var Person = db.models.person;
		    // var Pet    = db.models.pet;
            // var User = db.models.user;


            // var device = db.models.device;
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
app.get('/users', function (req, res){
    req.models.user.count(function (err, count){
        console.log(count + ' users');
    });

    req.models.user.find(
        {},
        {},
        function (err, all_users){

            if(!err){
                res.send(JSON.stringify(all_users));
                res.status(200).send();
            }
            else{
                res.status(400).send();
            }
            
    });
});

//GET - show individual User
app.get('/users/:user_id', function (req, res) {
    req.models.user.get(req.params.user_id, function (err, user) {
        if (err===null) {
            res.send(JSON.stringify(user));
        } else {
            res.status(404).send('Not found');
        }
    });
});


//PUT updates user
app.put('/users/:user_id', function (req, res){

    req.models.user.get(req.params.user_id, function(err, user){
        if(!err){
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.password = req.body.password;

            user.save(function(err){
                if(!err){
                    res.send(user);
                    res.status(200).send();
                }
                else{
                    //Assume it's because of bad syntax, could we try catch for specific errors?
                    res.status(400).send("Could not update user");
                }
            })
        }
        else{
            res.status(404).send("User was not found");
        }
    });
});


//POST - create new user
app.post("/users", function(req, res){

    req.models.user.create(
        [{
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        },],
        function(err, user_created){
            res.send(JSON.stringify(user_created)); 
    });
});

//DELETE - destroy User
app.delete('/users/:user_id', function (req, res){
    return req.models.user.find({id: req.params.user_id}).remove(function (err){
        if(!err){
            console.log("removed");
        }
        else{
            console.log(err);
        }
    })
});





app.get("/test", function (req, res) {
    console.log("Hello World");
  	res.send('Hello World');
});