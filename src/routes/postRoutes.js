const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost,
  addComment
} = require('../controllers/postController');

// Public Routes (No authentication required)
router.route('/')
  .get(getAllPosts);

router.route('/:id')
  .get(getPostById);

router.route('/:id/comments')
  .post(addComment); 

// Protected Routes (Authentication required)
// Middleware is applied sequentially before the controller functions
router.route('/')
  .post(authenticateToken, createPost);

router.route('/:id')
  .put(authenticateToken, updatePost)
  .delete(authenticateToken, deletePost);

module.exports = router;
