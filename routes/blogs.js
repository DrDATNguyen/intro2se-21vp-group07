//blog routes

const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const multer = require('multer');
const User = require('../models/usermodel');
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
router.get('/:slug', async (request, response) => {
  let blog = await Blog.findOne({ slug: request.params.slug });

  if (blog) {
    response.render('../font-users/single-standard', { blog: blog });
  } else {
    response.redirect('/');
  }
});
router.get('/login', (req, res) => {
  res.render('font-users/login');
});


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

router.get('/new/:id', async (request, response) => {
  const userID = request.params.id;
  console.log(userID);
  const currentUser = await User.findById(userID);
  if(currentUser){
    console.log(currentUser);
  }
  response.render('new', {users: currentUser});
});


router.post('/new/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, author,introduction, description,tags } = req.body;
    const imageFile = req.files['image'];
    const videoFile = req.files['video'];
    const authorID = req.params.id;
    
    const newBlog = new Blog({
      title,
      author,
      introduction,
      description,
      authorID,
      tags: tags.split(',').map(tag => tag.trim()).join(', '),
    });

    if (imageFile && imageFile[0]) {
      console.log('Image buffer size:', imageFile[0].buffer.length);
      newBlog.img = {
        data: imageFile[0].buffer,
        contentType: imageFile[0].mimetype,
      };
    }
    
    if (videoFile && videoFile[0]) {
      console.log('Video buffer size:', videoFile[0].buffer.length);
      newBlog.video = {
        data: videoFile[0].buffer,
        contentType: videoFile[0].mimetype,
      };
    }

    await newBlog.save();
    res.redirect(`/blogs/${newBlog.slug}`);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error uploading data.');
  }
});
// 




//route to handle updates
router.put('/edit/:id', async (request, response) => {
  request.blog = await Blog.findById(request.params.id);
  let blog = request.blog;
  blog.title = request.body.title;
  blog.author = request.body.author;
  blog.introduction = request.body.introduction;
  blog.description = request.body.description;
  blog.img= request.body.img;
  blog.video = request.body.video;
  blog.tags = request.body.tags
  try {
    blog = await blog.save();
    //redirect to the view route
    response.redirect(`/blogs/${blog.slug}`);
  } catch (error) {
    console.log(error);
    response.redirect(`/seblogs/edit/${blog.id}`, { blog: blog });
  }
});
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

router.post('/search', async (req, res) => {
  try {
    const userID = req.body.userID; 
    console.log(userID);
    const currentUser = await User.findById(userID);
    console.log(userID); // Log the userID for debugging
    
    const searchQuery = req.body.search; // Get the search query from the form data
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

router.get('/:id/category/1', async(req,res) =>{
  try {
    const userID = req.params.id; 
    const currentUser = await User.findById(userID);
    const searchQuery = 'động vật có vú';
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

router.get('/:id/category/2', async(req,res) =>{
  try {
    const userID = req.params.id; 
    const currentUser = await User.findById(userID);
    const searchQuery = 'động vật có vỏ';
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

router.get('/:id/category/3', async(req,res) =>{
  try {
    const userID = req.params.id; 
    const currentUser = await User.findById(userID);
    const searchQuery = 'động vật không có xương sống';
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

router.get('/:id/category/4', async(req,res) =>{
  try {
    const userID = req.params.id; 
    const currentUser = await User.findById(userID);
    const searchQuery = 'chim';
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

router.get('/:id/category/5', async(req,res) =>{
  try {
    const userID = req.params.id; 
    const currentUser = await User.findById(userID);
    const searchQuery = 'cá';
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

router.get('/:id/category/6', async(req,res) =>{
  try {
    const userID = req.params.id; 
    const currentUser = await User.findById(userID);
    const searchQuery = 'lưỡng cư';
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

router.get('/:id/category/7', async(req,res) =>{
  try {
    const userID = req.params.id; 
    const currentUser = await User.findById(userID);
    const searchQuery = 'côn trùng';
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

router.get('/:id/category/6', async(req,res) =>{
  try {
    const userID = req.params.id; 
    const currentUser = await User.findById(userID);
    const searchQuery = 'giáp xác';
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
    res.render('index', {
      user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error searching for blogs.');
  }
});

module.exports = router;
