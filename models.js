module.exports = function (db, cb) 
{
    db.define("user", 
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

    db.define("question", 
        {
            date_posted : Date,
            content     : String, 
        }, {
    });
    db.models.question.hasOne("owner", db.models.user, { reverse: 'questions' });

    db.define("comment", 
        {
            date_posted : Date,
            comment : String, 
        }, {
    });
    db.models.comment.hasOne("question", db.models.question, { reverse: 'comments'});
    db.models.comment.hasOne("owner", db.models.user, { reverse: 'comments'});


    db.define("answer", 
        {
            answer : String,
            date_posted : Date,

        }, {
    });

    db.models.answer.hasOne("question", db.models.question, { reverse: 'comments'});
    db.models.answer.hasOne("owner", db.models.user, { reverse: 'comments'});

    return cb();
}

module.exports.connect = function(cb) {
  orm.connect(module.exports.connectionString, function(err, db) {
    if (err) return cb(err);

    module.exports.define(db);

    cb(null, db);
  });
};