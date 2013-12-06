var express = require('express');
var orm = require('orm');
var app = express();

app.use(orm.express("sqlite://test.db", 
{
    define: function (db, models, next) 
    {
    	db.load("./models", function (err) {
		    // loaded!
		    var Person = db.models.person;
		    var Pet    = db.models.pet;
		});
    }
}));

app.listen(8888);
console.log("Server running at http://127.0.0.1:8888/");

app.get("/test", function (req, res) {
    console.log("Hello World");
  	res.send('Hello World');
});