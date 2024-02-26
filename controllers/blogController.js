// Asynchandler automatically sends async errors to the higher level error handler in app
const asyncHandler = require('express-async-handler');

// checkLogin to validate user exists;
const checkLogin = require('../middleware/checkLogin-middleware');

// To validate form results
const { body, param, validationResult } = require('express-validator');

//Database
const { makePool } = require('../config/db-config');
const createError = require('http-errors');

// TODO: make 'db-config' have a static var that is accessible by all files that import it. 
// Initialize db=config buy doing something like.. db-config.config(), but only once when the app is started.
const db = makePool(process.env.POSTGRES_USER, process.env.POSTGRES_PW,process.env.POSTGRES_DB);

/////////////////////////////////////////////////////////////////////////////////

// CREATE a post
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
        if(!validationErrors.isEmpty()) return res.status(403).json({msg:'POST denied. See errors for details', errors: validationErrors.array().map((error)=>error.msg)})

        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: [post]} = await db.query('INSERT INTO post(title, details) VALUES ($1,$2) RETURNING *',[req.body.title, req.body.details])
            .catch((err) => { return next(createError(500, 'Error entering post into database')) }) || { rows: [] };

        if (!post) return next(createError(500, 'Error entering post into database'));

        //Return the post id too in case front-end needs to use it for something
        res.status(201).json({msg: 'Post successfully entered into database', details: {
            title: post.title,
            pid: post.pid,
            created_at: post.created_at
        }})

    })
]

// GET ALL POSTS
// TODO: Limit number of posts / pagination, filter posts, sort posts in query?
exports.read_posts = asyncHandler(async function (req,res,next){
    //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
    const {rows: post} = await db.query('SELECT * FROM post')
        .catch((err) => { return next(createError(500, 'Error fetching posts from database')) }) || { rows: undefined };
    
    if(!post) return next(createError(404));
    
    //Return the post id too in case front-end needs to use it for something
    res.status(200).json({msg:'Found all posts', details: post})
});

// GET single post
exports.read_post = [ 
    param('pid', 'Invalid parameter format')
        .trim()
        .isString()
        .notEmpty()
        .escape(),
    asyncHandler(async function(req, res, next) {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return res.status(400).json({msg:'GET denied.', errors: validationErrors.array().map((error)=>error.msg)})

        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: [post]} = await db.query('SELECT * FROM post WHERE pid = $1 LIMIT 1',[req.params.pid])
            .catch((err) => { return next(createError(500, 'Error fetching post from database')) }) || { rows: [] };

        //Return the post id too in case front-end needs to use it for something
        if(!post) return next(createError(404));
        console.log(post);

        res.status(200).json({msg: 'Found post', details: {
            title: post.title,
            pid: post.pid,
            created_at: post.created_at
        }})
    })
]

// UPDATE a post
exports.update_post = [
    checkLogin, 
    param('pid', 'Invalid parameter format')
        .trim()
        .isString()
        .notEmpty()
        .escape(),
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
        if(!validationErrors.isEmpty()) return res.status(403).json({msg:'PUT denied. See errors for details', errors: validationErrors.array().map((error)=>error.msg)})

        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: [post]} = await db.query('UPDATE post SET title = $1, details = $2 WHERE pid = $3 RETURNING *',[req.body.title, req.body.details, req.params.pid])
            .catch((err) => { return next(createError(500, 'Error updating post in the database')) }) || { rows: [] };

        if (!post) return next(createError(500, 'Error updating post in the database'));

        //Return the post id too in case front-end needs to use it for something
        res.status(201).json({msg: 'Post successfully updated in the database', details: {
            title: post.title,
            pid: post.pid,
            created_at: post.created_at, 
            updated_at: post.updated_at
        }})

    })
]

// DELETE a post
exports.delete_post = [
    checkLogin,
    param('pid', 'Invalid parameter format')
        .trim()
        .isString()
        .notEmpty()
        .escape(),
    asyncHandler(async function(req, res, next) {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return res.status(403).json({msg:'DELETE denied. See errors for details', errors: validationErrors.array().map((error)=>error.msg)})

        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: [post]} = await db.query('DELETE FROM post WHERE pid = $1 RETURNING *',[req.params.pid])
            .catch(() => next(createError(500, 'Error deleting post in the database'))) || { rows: [] };

        if (!post) return next(createError(404, 'Cannot delete. Post not found'));

        //Return the post id too in case front-end needs to use it for something
        res.status(201).json({msg: 'Post successfully deleted in the database', details: post})

    })
]

/////////////////////////////////////////////////////////////////////////////////

// CREATE a comment
exports.create_comment = [
    checkLogin, 
    param('pid', 'Invalid parameter format')
        .trim()
        .isString()
        .notEmpty()
        .escape(),
    body('details')
        .trim()
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title cannot be empty')
        .escape(),
    asyncHandler(async function(req, res, next) {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return res.status(403).json({msg:'POST denied. See errors for details', errors: validationErrors.array().map((error)=>error.msg)})

        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: [post]} = await db.query('INSERT INTO comment(details,post_id) VALUES ($1,$2) RETURNING *',[req.body.details,req.params.pid])
            .catch((err) => { 
                console.log(err);
                return next(createError(500, 'Error entering comment into database')) }
            ) || { rows: [] };

        if (!post) return next(createError(500, 'Error entering comment into database'));

        //Return the post id too in case front-end needs to use it for something
        res.status(201).json({msg: 'Comment successfully entered into database', details: {
            cid: post.cid,
            post_id: post.post_id,
            created_at: post.created_at,
            details: post.details
        }})

    })
]

// READ single comment
exports.read_comment = [ 
    param('pid', 'Invalid parameter format')
        .trim()
        .isString()
        .notEmpty()
        .escape(),
    param('cid', 'Invalid parameter format')
        .trim()
        .isString()
        .notEmpty()
        .escape(),
    asyncHandler(async function(req, res, next) {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return res.status(400).json({msg:'GET denied.', errors: validationErrors.array().map((error)=>error.msg)})

        console.log('get');

        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: [comment]} = await db.query('SELECT * FROM comment WHERE cid = $1 LIMIT 1',[req.params.cid])
            .catch(() => next(createError(500, 'Error fetching post from database'))) || { rows: [] };

        if(!comment) return next(createError(404));

        //Return the comment id too in case front-end needs to use it for something
        res.status(200).json({msg: 'Found post', details: {
            title: comment.title,
            pid: comment.pid,
            created_at: comment.created_at
        }})
    })
]

// Delete a single comment
exports.delete_comment = [
    checkLogin, 
    param('pid', 'Invalid parameter format')
        .trim()
        .isString()
        .notEmpty()
        .escape(),
    body('details')
        .trim()
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title cannot be empty')
        .escape(),
    asyncHandler(async function(req, res, next) {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) return res.status(403).json({msg:'DELETE denied. See errors for details', errors: validationErrors.array().map((error)=>error.msg)})

        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: [post]} = await db.query('DELETE FROM comment WHERE cid = $1 RETURNING*',[req.body.details,req.params.pid])
            .catch((err) => { 
                console.log(err);
                return next(createError(500, 'Error entering comment into database')) }
            ) || { rows: [] };

        if (!post) return next(createError(500, 'Error entering comment into database'));

        //Return the post id too in case front-end needs to use it for something
        res.status(201).json({msg: 'Comment successfully entered into database', details: {
            cid: post.cid,
            post_id: post.post_id,
            created_at: post.created_at,
            details: post.details
        }})

    })
]

// GET ALL comments for a post
// TODO: Limit number of posts / pagination, filter posts, sort posts in query?
exports.read_comments = [
    param('pid', 'Invalid parameter format')
    .trim()
    .isString()
    .notEmpty()
    .escape(),
    asyncHandler(async function (req,res,next){
        //Destructure the result into the 'post' variable, because that's all we care about. Give it default value of 'undefined' in case the await fails.
        const {rows: comment} = await db.query('SELECT * FROM comment WHERE post_id = $1',[req.params.pid])
            .catch((err) => { return next(createError(500, 'Error fetching comments from database')) }) || { rows: undefined };
        
        if(!comment || !comment.length) return next(createError(404));
        
        //Return the post id too in case front-end needs to use it for something
        res.status(200).json({msg:'Found all comments', details: comment})
    })
];