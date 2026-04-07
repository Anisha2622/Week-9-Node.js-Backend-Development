// Simulated In-Memory Database
let posts = [
  {
    id: 1,
    title: 'Getting Started with Node.js',
    content: 'Node.js is a powerful JavaScript runtime built on Chrome V8 engine...',
    author: 'admin',
    createdAt: new Date().toISOString(),
    comments: [
      { id: 101, text: 'Great article!', author: 'reader1' }
    ]
  }
];

// @desc    Get all blog posts
// @route   GET /api/posts
exports.getAllPosts = (req, res, next) => {
  try {
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
exports.getPostById = (req, res, next) => {
  try {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    
    if (!post) {
      const error = new Error(`Post not found with id of ${req.params.id}`);
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Requires JWT)
exports.createPost = (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    // Request Validation
    if (!title || !content || typeof title !== 'string' || typeof content !== 'string') {
      const error = new Error('Please provide valid title and content');
      error.statusCode = 400;
      throw error;
    }
    
    const newPost = {
      id: posts.length ? posts[posts.length - 1].id + 1 : 1,
      title,
      content,
      author: req.user.username, // Pulled from the verified JWT token
      createdAt: new Date().toISOString(),
      comments: []
    };
    
    posts.push(newPost);
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Requires JWT)
exports.updatePost = (req, res, next) => {
  try {
    const { title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
      const error = new Error(`Post not found with id of ${req.params.id}`);
      error.statusCode = 404;
      throw error;
    }

    // Check Authorization: Only the author can update the post
    if (posts[postIndex].author !== req.user.username) {
        const error = new Error('You are not authorized to update this post');
        error.statusCode = 403;
        throw error;
    }
    
    // Update fields
    posts[postIndex] = {
      ...posts[postIndex],
      title: title || posts[postIndex].title,
      content: content || posts[postIndex].content,
      updatedAt: new Date().toISOString()
    };
    
    res.status(200).json({ success: true, data: posts[postIndex] });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Requires JWT)
exports.deletePost = (req, res, next) => {
  try {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
      const error = new Error(`Post not found with id of ${req.params.id}`);
      error.statusCode = 404;
      throw error;
    }

    // Check Authorization: Only the author can delete the post
    if (posts[postIndex].author !== req.user.username) {
        const error = new Error('You are not authorized to delete this post');
        error.statusCode = 403;
        throw error;
    }
    
    posts.splice(postIndex, 1);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
exports.addComment = (req, res, next) => {
  try {
    const { text, author } = req.body;
    const post = posts.find(p => p.id === parseInt(req.params.id));
    
    if (!post) {
      const error = new Error(`Post not found with id of ${req.params.id}`);
      error.statusCode = 404;
      throw error;
    }
    
    if (!text) {
      const error = new Error('Comment text is required');
      error.statusCode = 400;
      throw error;
    }
    
    const newComment = {
      id: Date.now(),
      text,
      author: author || 'Anonymous',
      createdAt: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};
