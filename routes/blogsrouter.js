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
// 




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

router.post('/search', BlogControllers.search);

router.get('/:id/category/1', BlogControllers.category1);

router.get('/:id/category/2', BlogControllers.category2);

router.get('/:id/category/3', BlogControllers.category3);

router.get('/:id/category/4', BlogControllers.category4);

router.get('/:id/category/5', BlogControllers.category5);

router.get('/:id/category/6', BlogControllers.category6);

router.get('/:id/category/7', BlogControllers.category7);

router.get('/:id/category/8', BlogControllers.category8);

module.exports = router;
