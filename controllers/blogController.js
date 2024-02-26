// Asynchandler automatically sends async errors to the higher level error handler in app
const asyncHandler = require('express-async-handler');

// checkLogin to validate user exists;
const checkLogin = require('../middleware/checkLogin-middleware');

// To validate form results
const { body, validationResult } = require('express-validator');

//Database
const { makePool } = require('../config/db-config');
const createError = require('http-errors');

// TODO: make 'db-config' have a static var that is accessible by all files that import it. 
// Initialize db=config buy doing something like.. db-config.config(), but only once when the app is started.
const db = makePool(process.env.POSTGRES_USER, process.env.POSTGRES_PW,process.env.POSTGRES_DB);

exports.create_post = [
    checkLogin, 
    body('title')
        .trim()
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title cannot be empty')
        .escape(),
    body('details')
        .trim()
        .isString().withMessage('Details must be a string')
        .notEmpty().withMessage('Details cannot be empty')
        .escape(),
    asyncHandler(async function(req, res, next) {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return res.status(403).json({msg:'POST denied. See errors', errors: validationErrors.array().map((error)=>error.msg)})

        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: [post = undefined]} = await db.query('INSERT INTO post(title, details) VALUES ($1,$2) RETURNING *',[req.body.title, req.body.details])
            .catch((err) => { return next(createError(500, 'Error entering post into database')) }) || {rows: []};

        //Return the post id in case front-end needs to use it for something
        if(post) res.status(201).json({msg: 'Post successfully entered into database', details: {
            title: post.title,
            pid: post.pid,
            created_at: post.created_at
        }})
    })
]