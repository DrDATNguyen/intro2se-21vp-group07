//blog routes

const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.get('/new', (request, response) => {
  response.render('new');
});

//view route
router.get('/:slug', async (request, response) => {
  let blog = await Blog.findOne({ slug: request.params.slug });

  if (blog) {
    response.render('show', { blog: blog });
  } else {
    response.redirect('/');
  }
});

//route that handles new post
router.post('/', upload.single('image'), async (request, response) => {
  console.log(request.file.path);
  // console.log(request.body);
  // Chuyển đổi đường dẫn tệp tạm thời thành đường dẫn tệp gốc
  // const originalFilePath = path.join(__dirname, '..', request.file.path);
  // let blog = new Blog({
  //   title: request.body.title,
  //   author: request.body.author,
  //   description: request.body.description,
  //   img: originalFilePath,
  //});

  try {
    const { title, author, description } = request.body;
    const { buffer, mimetype } = request.file;

    const newBlog = new Blog({
      title,
      author,
      description,
      img: {
        data: buffer,
        contentType: mimetype,
      },
    });
    //blog = await blog.save();
    await newBlog.save();
    response.redirect(`blogs/${newBlog.slug}`);
  } catch (error) {
    console.log(error);
  }
});

// route that handles edit view
router.get('/edit/:id', async (request, response) => {
  let blog = await Blog.findById(request.params.id);
  response.render('edit', { blog: blog });
});

//route to handle updates
router.put('/:id', async (request, response) => {
  request.blog = await Blog.findById(request.params.id);
  let blog = request.blog;
  blog.title = request.body.title;
  blog.author = request.body.author;
  blog.description = request.body.description;
  blog.img= request.body.img
  try {
    blog = await blog.save();
    //redirect to the view route
    response.redirect(`/blogs/${blog.slug}`);
  } catch (error) {
    console.log(error);
    response.redirect(`/seblogs/edit/${blog.id}`, { blog: blog });
  }
});

///route to handle delete
// router.delete('/:id', async (request, response) => {
//   await Blog.findByIdAndDelete(request.params.id);
//   response.redirect('/');
// });

module.exports = router;
