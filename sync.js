var orm = require('orm');
var models = require('./models');


orm.connect("sqlite://test.db", function (err, db) {
	db.load("./models", function (err) {
	    // loaded!
	    var Person = db.models.person;
	    var Pet    = db.models.pet;
	});
	db.sync()
});
