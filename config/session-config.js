const session = require('express-session');
const genFunc = require('connect-pg-simple');
const PostgresqlStore = genFunc(session);

function initialize(app, secret, db_uri){
    //Session storage
    app.use(session({ 
        secret, 
        resave: false, 
        saveUninitialized: true,
        store: new PostgresqlStore({conString: db_uri}),
        cookie: {
            maxAge: 1000 * 60 * 60 // One hour session
        }
    }));

}

module.exports = {
    initialize
};