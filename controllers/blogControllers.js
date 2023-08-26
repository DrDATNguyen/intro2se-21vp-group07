const User = require('../models/usermodel');
const Blog = require('../models/Blog');
const SearchKeyword = require('../models/SearchKeyword'); // Đảm bảo bạn đã import model SearchKeyword

exports.getBlog = async (request, response) => {
  let blog = await Blog.findOne({ slug: request.params.slug }).populate({
      path: 'comments',
      populate: {
          path: 'commentBy',
          model: 'User',
      },
  }).exec();
  
  // Tạo một mảng chứa các từ khóa từ chuỗi tags của bài viết hiện tại
  const currentTags = blog.tags.split(',').map(tag => tag.trim());

  // Tạo một biểu thức chính quy từ mảng các từ khóa
  const regexTags = currentTags.map(tag => new RegExp(tag, 'i'));

  // Tìm các bài viết liên quan bằng cách kiểm tra tags
  const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id }, // Loại bỏ bài viết hiện tại
      tags: { $in: regexTags } // Tìm bài viết có tags khớp với tags của bài viết hiện tại
  }).exec();
  
   // Mảng chứa các từ khóa trùng tìm được
  //  const matchingTags = [];
    
  //  // Kiểm tra từng từ khóa trong chuỗi tags hiện tại
  //  currentTags.forEach(tag => {
  //      relatedBlogs.forEach(relatedBlog => {
  //          const relatedTags = relatedBlog.tags.split(',').map(t => t.trim());
  //          if (relatedTags.includes(tag)) {
  //              matchingTags.push(tag);
  //          }
  //      });
  //  });
   
   // Hiển thị các thông tin kiểm tra trên console để debu
  //  console.log('Matching Tags:', matchingTags);
  
  if (blog) {

      response.render('../font-users/single-standard', { blog: blog, relatedBlogs: relatedBlogs, user: request.session.user });
      blog.views += 1;
      // Lưu thay đổi vào cơ sở dữ liệu
    await blog.save();
  } else {
      request.flash('message', 'Connot found this blog... why ?');
      request.flash('title', 'We wonder the same thing, why ?');
      request.flash('href', '/user/home'); 
      response.render('error', {
          message: request.flash('message'),
          title: request.flash('title'),
          href: request.flash('href')
      });
  }
}
// async function createView() {
//   try {
//     const newView = new View();
//     await newView.save();
//   } catch (error) {
//     console.error(error);

//   }
// }

exports.filterBlogs = async (sortBy) => {
  try {
    let sortCriteria = {};

    if (sortBy === 'mostPopular') {
      sortCriteria = { views: -1, timeCreated: -1 };
    } else if (sortBy === 'leastPopular') {
      sortCriteria = { views: 1, timeCreated: -1 };
    } else if (sortBy === 'oldest') {
      sortCriteria = { timeCreated: 1 };
    } else if (sortBy === 'newest') {
      sortCriteria = { timeCreated: -1 };
    }
    console.log('Sort Criteria:', sortCriteria);
    const blogs = await Blog.find({ views: { $exists: true } }).sort(sortCriteria).exec();

    return blogs;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while filtering blogs.');
  }
};
exports.getHome = async(req,res) =>{
  try{
    const user = req.session.user;
    const blogs = await Blog.find().sort({ createdAt: 'desc' });
    res.render('index', {
      user: user,
      blogs: blogs,
    })
  }
  catch(err){
    console.log(err);
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
  }
}

exports.getLogin = (req, res) => {
    res.render('user/login');
}

exports.getNewBlog = async (request, response) => {
    const userID = request.params.id;
    console.log(userID);
    const currentUser = await User.findById(userID);
    if(currentUser){
      console.log(currentUser);
    }
    else{
        req.flash('message', 'You have logged in and still see this error ? Well... Ooops');
        req.flash('title', 'Who are you');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
    response.render('new', {users: currentUser});
}

exports.postNewBlog = async (req, res) => {
    try {
      const { title, author,introduction, description,tags } = req.body;
      const imageFile = req.files['image'];
      const videoFile = req.files['video'];
      const authorID = req.params.id;
      const price = parseInt(req.body.price);
      console.log(price);
      let isPremium = false;
      if(price > 0){
        isPremium = true;
      }
    
      
      const newBlog = new Blog({
        title,
        author,
        introduction,
        description,
        authorID,
        tags: tags.split(',').map(tag => tag.trim()).join(', '),
        price: price,
        isPremium: isPremium,
        likes: 0,
        views: 0
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
        req.flash('message', 'Yeah... something that can happen too...');
        req.flash('title', 'An error occurred while uploading your data');
        req.flash('href', '/user/home'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
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
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/home'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
} 

exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id; // Lấy blogId từ tham số trong URL
  const userId = req.session.user.id;
  try {
    // Tìm bài viết cần xóa trong cơ sở dữ liệu
    const blogToDelete = await Blog.findById(blogId);
    
    if (!blogToDelete) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Xóa bài viết
    await blogToDelete.remove();
    res.redirect(`/user/${userId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};
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
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
}
exports.search1 = async (req, res) => {
  try {
    // const userID = req.body.userID; 
    // console.log(userID);
    // const currentUser = await User.findById(userID);
    // console.log(userID); // Log the userID for debugging
    
    const searchQuery = req.body.search; // Get the search query from the form data
    const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
    
     // Cập nhật hoặc tạo mới thông tin từ khóa tìm kiếm
  await updateSearchKeywords(searchQuery);

    res.render('../font-users/main', {
      // user: currentUser,
      blogs: blogs
    });
  } catch (e) {
    console.log(e);
      req.flash('message', 'Something went wrong');
      req.flash('title', 'An error occurred while processing your request');
      req.flash('href', '/user/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
  }
}
exports.category1 = async(req,res) =>{
    try {
      const searchQuery = 'động vật có vú';
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
      res.render('index', {
        user: req.session.user,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
      req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
}

exports.category2 = async(req,res) =>{
    try {
      const searchQuery = 'động vật có vỏ';
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
      res.render('index', {
        user: req.session.user,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
      req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
}

exports.category3 = async(req,res) =>{
    try {
      const searchQuery = 'động vật không có xương sống';
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
      res.render('index', {
        user: req.session.user,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
}

exports.category4 = async(req,res) =>{
    try {
      const searchQuery = 'chim';
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
      res.render('index', {
        user: req.session.user,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
}

exports.category5 = async(req,res) =>{
    try {
      const searchQuery = 'cá';
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
      res.render('index', {
        user: req.session.user,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
      req.flash('message', 'Something went wrong');
      req.flash('title', 'An error occurred while processing your request');
      req.flash('href', '/user/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
    }
}

exports.category6 = async(req,res) =>{
    try {
      const searchQuery = 'lưỡng cư';
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
      res.render('index', {
        user: req.session.user,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
      req.flash('message', 'Something went wrong');
      req.flash('title', 'An error occurred while processing your request');
      req.flash('href', '/user/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
    }
}

exports.category7 = async(req,res) =>{
    try {
      const searchQuery = 'côn trùng';
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
      res.render('index', {
        user: req.session.user,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
      req.flash('message', 'Something went wrong');
      req.flash('title', 'An error occurred while processing your request');
      req.flash('href', '/user/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
    }
}

exports.category8 = async(req,res) =>{
    try {
      const searchQuery = 'giáp xác';
      const blogs = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } }).exec();
      
      res.render('index', {
        user: req.session.user,
        blogs: blogs
      });
    } catch (e) {
      console.log(e);
      req.flash('message', 'Something went wrong');
      req.flash('title', 'An error occurred while processing your request');
      req.flash('href', '/user/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
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
    req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
  }
}
