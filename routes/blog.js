var express = require('express');
var router = express.Router();
const createError = require('http-errors');

// Asynchandler automatically sends async errors to the higher level error handler in app
const asyncHandler = require('express-async-handler');

// checkLogin to validate user exists;
const checkLogin = require('../middleware/checkLogin-middleware');

// To validate form results
const { body, validationResult } = require('express-validator');
const { create } = require('domain');

// Controllers
const blogController = require('../controllers/blogController')

////////////////////////////////////////////////////////////////////////////////

// Default route -> Redirect to posts
router.get('/', function(req, res, next) {
    res.redirect('/api/blog/posts');
});

// READ all posts
router.get('/posts', function(req, res, next) {
    res.status(501).json({msg: 'To be implemented: GET /posts'})
});

// CREATE a post
router.post('/posts', blogController.create_post);

////////////////////////////////////////////////////////////////////////////////

// READ single post
router.get('/post/:pid', function(req, res, next) {
    res.status(501).json({msg: 'To be implemented: GET /post/<postID>'})
});
// UPDATE single post (with a patch)
router.patch('/post/:pid', checkLogin, function(req, res, next) {
    res.status(501).json({msg: 'To be implemented: PATCH /post/<postID>'})
});
// DELETE single post (with a patch)
router.delete('/post/:pid', checkLogin, function(req, res, next) {
    res.status(501).json({msg: 'To be implemented: DELETE /post/<postID>'})
});

////////////////////////////////////////////////////////////////////////////////

// READ all comments for a post
router.get('/post/:pid/comments', function(req, res, next) {
    res.status(501).json({msg: 'To be implemented: GET /post/<postID>/comments'})
});

////////////////////////////////////////////////////////////////////////////////

// READ single comment for a post (is this.. needed?)
router.get('/post/:pid/comment/:cid', function(req, res, next) {
    res.status(501).json({msg: 'To be implemented: GET /post/<postID>/comments/<commentID>'})
});

// CREATE single comment for a post
router.post('/post/:pid/comment/:cid', function(req, res, next) {
    res.status(501).json({msg: 'To be implemented: POST /post/<postID>/comments/<commentID>'})
});

// UPDATE single comment for a post
router.patch('/post/:pid/comment/:cid', function(req, res, next) { res.next(create(405,'Operation not allowed'))});
router.put('/post/:pid/comment/:cid', function(req, res, next) {res.next(create(405,'Operation not allowed'))});

// DELETE single comment for a post
router.delete('/post/:pid/comment/:cid', checkLogin, function(req, res, next) {
    res.status(501).json({msg: 'To be implemented: GET /post/<postID>/comments/<commentID>'})
});

module.exports = router;