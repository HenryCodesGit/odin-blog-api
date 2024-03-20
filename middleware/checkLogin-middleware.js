// All this middleware does is check for existence of logged in user

const createError = require("http-errors")

/*
* This requires the usage of 'express-session' so that the user can be found from req.user
*
*
*
*/

function checkLogin (req, res, next){
    const err = (req.user) ? null : createError(403,'Not authorized without login');
    if(err){ return next(err)}
    return next();
}

module.exports = checkLogin;