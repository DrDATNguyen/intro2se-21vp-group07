//blog routes

const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const multer = require('multer');
const User = require('../models/usermodel');
const BlogControllers = require('../controllers/blogControllers')
const path = require('path');
const { get } = require('http');
//define storage for the images
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   //destination for files
//   destination: function (request, file, callback) {
//     callback(null, './public/uploads/images');
//   },

//   //add back the extension
//   filename: function (request, file, callback) {
//     // callback(null, file.originalname);
//     const timestamp = Date.now(); // Thêm một timestamp vào tên tệp
//     const originalname = file.originalname; // Lấy tên gốc của tệp
//     const filename = `${timestamp}-${originalname}`;
//     callback(null, filename); // Sử dụng tên với timestamp được thêm vào
//   },
// });
// const uploadVideo = multer({ storage: videoStorage });
//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 10000,
  },
});


// router.get('/index', (request, response) => {
//   response.render('../font-users/index');
// });
//view route
router.get('/:slug', BlogControllers.getBlog);
router.get('/login', BlogControllers.getLogin);


// router.get('/upload-video', (req, res) => {
//   res.sendFile(path.join(__dirname, 'upload-video.ejs'));
// });
// router.post('/', upload.single('video'), async (req, res) => {
//   // const { title, author, description } = req.body;
//   // const filePath = req.file.path;

//   try {
//     const {title, author, description } = req.body;
//     const filePath = req.file.filename;
//     const newBlog = new Blog({
//       title,
//       author,
//       description,
//       video: {
//         title,
//         description,
//         filePath
//       },
//     });
//     await newBlog.save();
//     res.send("Video uploaded successfully!");
//     response.redirect(`blogs/${newBlog.slug}`);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error uploading video.");
//   }
// });
// //route that handles new post
// router.post('/update', upload.single('image'), async (request, response) => {
//   console.log(request.file.path);
//   // console.log(request.body);
//   // Chuyển đổi đường dẫn tệp tạm thời thành đường dẫn tệp gốc
//   // const originalFilePath = path.join(__dirname, '..', request.file.path);
//   // let blog = new Blog({
//   //   title: request.body.title,
//   //   author: request.body.author,
//   //   description: request.body.description,
//   //   img: originalFilePath,
//   //});

//   try {
//     const { title, author, description } = request.body;
//     const { buffer, mimetype } = request.file;

//     const newBlog = new Blog({
//       title,
//       author,
//       description,
//       img: {
//         data: buffer,
//         contentType: mimetype,
//       },
//     });
//     //blog = await blog.save();
//     await newBlog.save();
//     response.redirect(`blogs/${newBlog.slug}`);
//   } catch (error) {
//     console.log(error);
//   }
// });

router.get('/new/:id', BlogControllers.getNewBlog);


router.post('/new/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), BlogControllers.postNewBlog);
router.get('/home', BlogControllers.getHome);




//route to handle updates
router.put('/edit/:id', BlogControllers.putEditBlog);
// router.get('/videos', async (req, res) => {
//   try {
//     const videos = await Video.find();
//     res.render('video_page', { videos });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching videos', error });
//   }
// });
///route to handle delete
// router.delete('/:id', async (request, response) => {
//   await Blog.findByIdAndDelete(request.params.id);
//   response.redirect('/');
// });
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
      // If it's an AJAX request, send a JSON response with the new comment
      return res.json({ success: true, comment: newComment });
    } else {
      // If it's a regular form submission, redirect
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

// Route để hiển thị giao diện chọn lọc
// router.get('/filter', (req, res) => {
//   res.render('/user/home');
// });

// Route để xử lý yêu cầu lọc bài viết
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
