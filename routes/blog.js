var express = require('express');
var router = express.Router();
const createError = require('http-errors');

// Controllers
const blogController = require('../controllers/blogController')

//Starting cors
const cors = require('cors');
const corsOptions = {
  origin: true,
  credentials: true
}

////////////////////////////////////////////////////////////////////////////////

// Default route. Redirect
router.get('/', (req, res, next) => res.redirect('/api/blog/posts'));

////////////////////////////////////////////////////////////////////////////////

// CREATE a post
router.post('/post', cors(corsOptions),blogController.create_post);
// READ single post
router.get('/post/:pid', blogController.read_post);
// UPDATE single post (with a put)
router.put('/post/:pid', cors(corsOptions), blogController.update_post);
// DELETE single post (with a patch)
router.delete('/post/:pid', cors(corsOptions), blogController.delete_post);

// READ all posts
router.get('/posts', cors(corsOptions),blogController.read_posts); // TODO: Limit number of posts / pagination, filter posts, sort posts in query?


////////////////////////////////////////////////////////////////////////////////

// CREATE single comment for a post
router.post('/post/:pid/comment', cors(corsOptions),blogController.create_comment);

// READ single comment for a post (is this.. needed?)
router.get('/post/:pid/comment/:cid', blogController.read_comment);

// UPDATE single comment for a post
router.put('/post/:pid/comment/:cid', (req,res,next)=>res.next(createError(405,'Operation not allowed')));

// DELETE single comment for a post
router.delete('/post/:pid/comment/:cid',cors(corsOptions), blogController.delete_comment);

// READ all comments for a post
router.get('/post/:pid/comments', blogController.read_comments);

////////////////////////////////////////////////////////////////////////////////

module.exports = router;