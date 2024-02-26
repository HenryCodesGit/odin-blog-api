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

// Default route. Redirect
router.get('/', (req, res, next) => res.redirect('/api/blog/posts'));

////////////////////////////////////////////////////////////////////////////////

// CREATE a post
router.post('/post', blogController.create_post);
// READ single post
router.get('/post/:pid', blogController.read_post);
// UPDATE single post (with a patch)
router.put('/post/:pid', blogController.update_post);
// DELETE single post (with a patch)
router.delete('/post/:pid', blogController.delete_post);

// READ all posts
router.get('/posts', blogController.read_posts); // TODO: Limit number of posts / pagination, filter posts, sort posts in query?


////////////////////////////////////////////////////////////////////////////////

// CREATE single comment for a post
router.post('/post/:pid/comment',blogController.create_comment);

// READ single comment for a post (is this.. needed?)
router.get('/post/:pid/comment/:cid', blogController.read_comment);

// UPDATE single comment for a post
router.put('/post/:pid/comment/:cid', (req,res,next)=>res.next(create(405,'Operation not allowed')));

// DELETE single comment for a post
router.delete('/post/:pid/comment/:cid', blogController.delete_comment);

// READ all comments for a post
router.get('/post/:pid/comments', blogController.read_comments);

////////////////////////////////////////////////////////////////////////////////

module.exports = router;