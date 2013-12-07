var orm = require('orm');
var models = require('./models');


orm.connect("sqlite://test.db", function (err, db) {
	db.load("./models", function (err) {
	    // loaded!
        var User = db.models.user;
        var Question = db.models.question;
        var Answer = db.models.answer;
	});
	db.sync()
});
