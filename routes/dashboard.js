const createError = require('http-errors');
const express = require('express');
const router = express.Router();

// Asynchandler automatically catches async errors and passes it as 'next(error)'
const asyncHandler = require('express-async-handler');

// To validate form results
// TODO: validation and also password encrypting
const { body } = require('express-validator');
const passport = require('passport');

//Starting cors
const cors = require('cors');
const corsOptions = {
  origin: true,
  credentials: true
}

// GET Returns differently if logged in
router.get('/', cors(corsOptions),function(req, res, next) {
  if(!req.user) return next(createError(401,'Not logged in'));
  
  return res.status(200).json({msg: `Logged in`, user: req.user.username})
});


// POST for logging in
router.post('/login',[
  cors(corsOptions),
  body('username').escape(), //Sanitize the username just in case
  body('password').escape(), //Sanitize the password just in case
  asyncHandler(async (req, res, next) => {
    //Redirect if already logged in
    if(req.user) return res.status(201).json({msg: 'Already logged in successful', user: req.user.username});
  
    await passport.authenticate('local', (err, user, info)=>{
      //Send error to handler if login problems or anything else
      if(err) return next(err);

      // Error if no user
      if(!user) return next(createError(401,'Incorrect username or password'));
  
      //Set the user info in the session
      req.login(user, () => res.status(201).json({msg: 'login successful', user: user.username}));
    })(req,res,next);
  })
]);

// POST for logging out
router.post('/logout', cors(corsOptions), asyncHandler(async (req, res, next) => {
  req.logout(async (err) => {
    if(err) return next(err);
    res.json({msg: 'logged out successfully'});
  });
}));

module.exports = router;
