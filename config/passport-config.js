const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); //TODO: in future different implementation for hashing than bcrypt

let database;

async function verifyFunction (username, password, done) {
    try {
        // Find user (by default postgres returns it as 'rows', and as an array.. so rename)
        const {rows: [user]} = await database.query('SELECT * FROM admin WHERE username = $1 LIMIT 1',[username]);
         if (!user) return done(null, false, { message: "Incorrect username or password" });

        // Check password
        const passMatch = bcrypt.compare(password, user.password)
        if (!passMatch) return done(null, false, { message: "Incorrect username or password" });
        
        //No errors? Return the user
        return done(null, user);
    } 
    catch(err) { 
        return done(err);
    };
}

function serializeFunction(user, done) { return done(null,user.userid); }
async function deserializeFunction(id, done) {
    try {
        const {rows: [user]} = await database.query('SELECT * FROM admin WHERE userid = $1 LIMIT 1',[id]);
        done(null, user);
    } 
    catch(err) {
        done(err);
    };
}

function initialize(app, db) {

    database = db;

    //Authentication strategy initialization
    passport.use(new LocalStrategy(verifyFunction));
    passport.serializeUser(serializeFunction);
    passport.deserializeUser(deserializeFunction);

    //Initialize the passport and use the session /w passport
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = {
    initialize
};