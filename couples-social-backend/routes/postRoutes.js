const express = require('express');
const router = express.Router();
const { createPost, getPostsByCouple,  updatePost,
  deletePost} = require('../controllers/postController');

router.post('/', createPost);
router.get('/:coupleId', getPostsByCouple);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);  


module.exports = router;
