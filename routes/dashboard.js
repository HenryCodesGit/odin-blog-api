const createError = require('http-errors');
const express = require('express');
const router = express.Router();

// Asynchandler automatically catches async errors and passes it as 'next(error)'
const asyncHandler = require('express-async-handler');

// To validate form results
// TODO: validation and also password encrypting
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// GET Returns differently if logged in
router.get('/', function(req, res, next) {
  if(!req.user) return next(createError(403,'Not logged in'));
  
  return res.status(200).json({msg: `Logged in`, user: req.user.username})
});

// POST for logging in
router.post('/login',  asyncHandler(async (req, res, next) => {

  // TODO: Ignore if already logged in

  await passport.authenticate('local', (err, user, info)=>{
    //Send error to handler if login problems or anything else
    if(err) next(err);

    //Set the user info in the session
    req.login(user, () => res.status(201).json({msg: 'login successful', user: user.username}));
  })(req,res,next);
}));

// POST for logging out
router.post('/logout',  asyncHandler(async (req, res, next) => {
  req.logout(async (err) => {
    if(err) return next(err);
    console.log('Redirecting');
    res.redirect('/api/dashboard');
  });
}));

module.exports = router;
