/*
-------------------------------------------------------------------------------------------
 Imports 
-------------------------------------------------------------------------------------------
*/

if(process.env.NODE_ENV === 'development') {
  console.log('Setting environmental variables for development mode');
  require('dotenv').config();
}

const DB_USER = process.env.POSTGRES_USER;
const DB_HOST = process.env.POSTGRES_HOST;
const DB_PW = process.env.POSTGRES_PW;
const DB_NAME = process.env.POSTGRES_DB;
const DB_URI = process.env.POSTGRES_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

const express = require('express');
const { rateLimit } = require('express-rate-limit')
const createError = require('http-errors');


const bcrypt = require('bcryptjs'); //TODO: in future different implementation for hashing than bcrypt. Also figure out how much to salt hashes.
const passportConfig = require('./config/passport-config');
const defaultConfig = require('./config/default-config');
const sessionConfig = require('./config/session-config');
const dbConfig = require('./config/db-config');

const topLevelErrors = require('./middleware/topLevelError-middleware');

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const blogRouter = require('./routes/blog');

/*
-------------------------------------------------------------------------------------------
  Initialize 
-------------------------------------------------------------------------------------------
*/

const app = express();

//Setting stuff for when hosting on fly io
app.set('trust proxy', true)

//Setting up rate limiter
app.use(rateLimit({
  windowMs: 60 * 1000, //One minute
  limit: 60, //Allow on average 1 request per second.
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
}))

//Starting cors
const cors = require('cors');
const corsOptions = {
  origin: true,
  credentials: true
}
app.use(cors(corsOptions));

// Initialize the db
// Note: Be sure to start the db in terminal before running app as well.
const db = dbConfig.makePool(DB_USER, DB_PW, DB_NAME,DB_HOST)

topLevelErrors.initialize(app);
sessionConfig.initialize(app,SESSION_SECRET,DB_URI);
passportConfig.initialize(app,db)
defaultConfig.initialize(app);


/*
-------------------------------------------------------------------------------------------
  Routes and middleware
-------------------------------------------------------------------------------------------
*/

// Middleware to catch top level errors (outside of routes);
app.use(topLevelErrors.middleware);

// Middleware to keep track of the current user in the session
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/api', indexRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/blog', blogRouter)

/*
-------------------------------------------------------------------------------------------
  Error Handling 
-------------------------------------------------------------------------------------------
*/

// If the route chain gets this far without returning a response, then assume 404 Error?
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(cors(corsOptions), function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {status: err.status};
  
  // Send the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
