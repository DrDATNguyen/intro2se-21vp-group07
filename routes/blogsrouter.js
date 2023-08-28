//blog routes

const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const multer = require('multer');
const User = require('../models/usermodel');
const BlogControllers = require('../controllers/blogControllers')
const path = require('path');
const { get } = require('http');
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 10000,
  },
});

router.get('/:slug', BlogControllers.getBlog);
router.get('/login', BlogControllers.getLogin);

router.get('/new/:id', BlogControllers.getNewBlog);


router.post('/new/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), BlogControllers.postNewBlog);
router.get('/home', BlogControllers.getHome);

router.get('/main', BlogControllers.getMain);
router.put('/edit/:id', BlogControllers.putEditBlog);
router.get('/api/posts', async (req, res) => {
  try {
    const pageNumber = req.query.page;
    const postsPerPage = 3; // Hoặc bất kỳ số lượng bạn muốn

    const startIndex = (pageNumber - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    const blogs = await Blog.find().sort({ createdAt: 'desc' });
    const paginatedBlogs = blogs.slice(startIndex, endIndex);

    res.json({ blogs: paginatedBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/add-comment/:blogSlug', async (req, res) => {
  try {
    const blogSlug = req.params.blogSlug;
    const content = req.body.content;
    console.log(req.session.user._id);
    const blog = await Blog.findOne({ slug: blogSlug }).populate({
      path: 'comments',
      populate: {
        path: 'commentBy',
        model: 'User',
      },
    }).exec();
    console.log(blog);
    console.log(blog.comments);

// If you want to access the username of the comment authors
    blog.comments.forEach(comment => {
    });
    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newComment = {
      content: content,
      createDate: Date.now(),
      commentBy: user._id
    };

    blog.comments.push(newComment);
    await blog.save();

    if (req.xhr) {
      return res.json({ success: true, comment: newComment });
    } else {
      return res.redirect(`/blogs/${blogSlug}`);
    }
    
  } catch (error) {
    console.error('Error adding comment:', error);

    if (req.xhr) {
      return res.status(500).json({ success: false, error: 'An error occurred while adding a comment' });
    } else {
      return res.status(500).send('An error occurred while adding a comment');
    }
  }
});

router.post('/filter/:userId', async (req, res) => {
  const sortBy = req.body.sortBy;
  const userId = req.params.userId;
  const currentUser = await User.findById(userId);
  try {
    const filteredBlogs = await BlogControllers.filterBlogs(sortBy);
    console.log('Sortcu:', sortBy);
    res.render('index', { blogs: filteredBlogs,user: currentUser });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while filtering blogs.');
  }
});
router.post('/:id/delete', BlogControllers.deleteBlog);
router.post('/search', BlogControllers.search);
router.post('/search1', BlogControllers.search1);

router.get('/category/1', BlogControllers.category1);

router.get('/category/2', BlogControllers.category2);

router.get('/category/3', BlogControllers.category3);

router.get('/category/4', BlogControllers.category4);

router.get('/category/5', BlogControllers.category5);

router.get('/category/6', BlogControllers.category6);

router.get('/category/7', BlogControllers.category7);

router.get('/category/8', BlogControllers.category8);

module.exports = router;
