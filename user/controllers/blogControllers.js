const User = require('../models/usermodel');
const Blog = require('../models/Blog');
const SearchKeyword = require('../models/SearchKeyword'); // Đảm bảo bạn đã import model SearchKeyword

exports.getBlog = async (request, response) => {
    let blog = await Blog.findOne({ slug: request.params.slug });
  
    if (blog) {
      response.render('../font-users/single-standard', { blog: blog });
    } else {
      response.redirect('/');
    }
}

exports.getLogin = (req, res) => {
    res.render('font-users/login');
}

exports.getNewBlog = async (request, response) => {
    const userID = request.params.id;
    console.log(userID);
    const currentUser = await User.findById(userID);
    if(currentUser){
      console.log(currentUser);
    }
    response.render('new', {users: currentUser});
}

exports.postNewBlog = async (req, res) => {
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
}

exports.putEditBlog = async (request, response) => {
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
} 

exports.search = async (req, res) => {
    try {
      const userID = req.body.userID; 
      console.log(userID);
      const currentUser = await User.findById(userID);
      console.log(userID); // Log the userID for debugging
      
      const searchQuery = req.body.search; // Get the search query from the form data
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
       // Cập nhật hoặc tạo mới thông tin từ khóa tìm kiếm
    await updateSearchKeywords(searchQuery);

      res.render('index', {
        user: currentUser,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
      res.status(500).send('Error searching for blogs.');
    }
}

exports.category1 = async(req,res) =>{
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
}

exports.category2 = async(req,res) =>{
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
}

exports.category3 = async(req,res) =>{
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
}

exports.category4 = async(req,res) =>{
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
}

exports.category5 = async(req,res) =>{
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
}

exports.category6 = async(req,res) =>{
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
}

exports.category7 = async(req,res) =>{
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
}

exports.category8 = async(req,res) =>{
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
}

async function updateSearchKeywords(keyword) {
  try {
    const existingKeyword = await SearchKeyword.findOne({ keyword });
    
    if (existingKeyword) {
      existingKeyword.count++;
      await existingKeyword.save();
    } else {
      const newKeyword = new SearchKeyword({ keyword });
      await newKeyword.save();
    }
  } catch (error) {
    console.error(error);
  }
}
