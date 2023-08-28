const Blog = require('../models/blog.model'); // Thay đổi đường dẫn tới model của bạn
const User = require('../models/user'); 
const Admin = require('../models/admin'); 
const SearchKeyword = require('../models/searchKeyword'); // Đảm bảo bạn đã import model SearchKeyword
const Visit = require('../models/visit');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const Report = require('../models/reports'); 
exports.getPendingPosts = async (req, res) => {
    try {
        const pendingPosts = await Blog.find({ verify: false }); // Lấy các bài viết chưa được duyệt
        const admin = req.session.admin;
        res.render('IndexPendingBlog', { pendingPosts:pendingPosts,admin:admin });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.approvePost = async (req, res) => {
    const postId = req.params.id;
    const admin = req.session.admin;
    try {
        const post = await Blog.findByIdAndUpdate(postId, { verify: true });
        const pendingPosts = await Blog.find({ verify: false });
        res.render('IndexPendingBlog',{ pendingPosts:pendingPosts,admin:admin }); // Điều hướng sau khi duyệt
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.gettablespendingUser = async (req, res) => {
    try {
        const pendingUsers = await User.find({ isUservip: false });
        const admin = req.session.admin; 
        res.render('tables-pending', { pendingUsers,admin:admin }); //
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.approvetablespendingUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const post = await User.findByIdAndUpdate(userId, { isUservip: true });
        const admin = req.session.admin;
        // const pendingUsers = await User.find({ isUservip: false }); 
        const users = await User.find();
        res.render('indexPendingUser', { users:users,admin:admin }); // Điều hướng sau khi duyệt
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
exports.listPopularKeywords = async (req, res) => {
    try {
      const popularKeywords = await SearchKeyword.find()
        .sort({ count: -1 }) // Sắp xếp từ nhiều xuống ít
        .exec();
  
      res.render('popular-keywords', { popularKeywords });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error listing popular keywords.');
    }
  }
  exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Lấy danh sách tất cả người dùng
        const admin = req.session.admin;
        // Render trang hiển thị danh sách người dùng
        res.render('indexPendingUser', { users:users,admin:admin }); // Thay đổi tên view và biến context tùy theo yêu cầu của bạn
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
exports.getNewBlog = async (request, response) => {
    const adminID = request.params.id;
    // const admin = request.session.admin;
    console.log(adminID);
    const currentAdmin = await Admin.findById(adminID);
    if(currentAdmin ){
      console.log(currentAdmin );
    }
    else{
        request.flash('message', 'You have logged in and still see this error ? Well... Ooops');
        request.flash('title', 'Who are you');
        request.flash('href', '/user/login'); 
        response.render('error', {
            message: request.flash('message'),
            title: request.flash('title'),
            href: request.flash('href')
        });
    }
    response.render('new', {admin: currentAdmin});
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
        isPremium: isPremium
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
      res.redirect(`/admin/pending-posts`);
    } catch (error) {
      console.log(error);
        req.flash('message', 'Yeah... something that can happen too...');
        req.flash('title', 'An error occurred while uploading your data');
        req.flash('href', '/admin/home'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
}
exports.getLogin = (req, res) => {
  res.render('login');
}
exports.postLogin = async (req, res) => {
  try {
    //if (req.body.username === "admin" && req.body.password === "admin123") {} // render admin page
    const admin = await Admin.findOne({ adminname: req.body.adminname });
    if(!admin){
      req.flash('message', 'Cannot find your account');
      req.flash('title', 'Cannot find your account, create one');
      req.flash('href', '/admin/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
    }
    if (admin && admin.password === req.body.password) {
      
      req.session.admin = admin;
      console.log('Admin logged in:', req.session.admin);
      res.redirect('/admin/home');
    } else {
      req.flash('message', 'You have entered the wrong password');
      req.flash('title', 'Wrong Password');
      req.flash('href', '/admin/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
    }
  } catch (error) {
    console.log(error);
    req.flash('message', 'Something went wrong');
    req.flash('title', 'An error occurred while processing your request');
    req.flash('href', '/admin/login'); 
    res.render('error', {
        message: req.flash('message'),
        title: req.flash('title'),
        href: req.flash('href')
    });
  }
}
exports.getSignup = (req, res) => {
  res.render('signup');
}

exports.postSignup = async (req, res) => {
const data = {
  adminname: req.body.adminname,
  password: req.body.password,
  email: req.body.email,
};

try {
  const checking = await Admin.findOne({ adminname: req.body.adminname });

  if (checking) {
      req.flash('message', 'This admin name has been taken, choose another one');
      req.flash('title', 'This admin name has already existed');
      req.flash('href', '/admin/signup'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
  } else {
    const defaultAvatarPath = path.join(__dirname,'../assets/profile2.jpg');

    data.avatarimg = {
      data: fs.readFileSync(defaultAvatarPath),
      contentType: 'image/jpeg' 
    };

    await Admin.create(data);
    const newAdmin = await Admin.findOne({ adminname: req.body.adminname });
    res.render('login', {
      admin: newAdmin,
    });
  }
} catch (error) {
      console.log(error);
      req.flash('message', 'Something went wrong');
      req.flash('title', 'An error occurred while processing your request');
      req.flash('href', '/admin/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
}
};

exports.getHome = async(req,res) =>{
try{
  const admin = req.session.admin;
  console.log(admin);
  // const blogs = await Blog.find().sort({ createdAt: 'desc' });
  // const userLikedBlog = Blog.likes.includes(user._id); // userId là ID của người dùng hiện tại
  const totalPosts = await Blog.countDocuments(); // Đếm tổng số bài viết
  const totalUsers = await User.countDocuments(); // Đếm tổng số người dùng
    // Giả sử bạn đã có một cơ chế lưu lượt truy cập và đếm số lượt truy cập
  const totalVisits = await countTotalVisits(); // Đếm tổng số lượt truy cập
  const popularKeywords = await listPopularKeywords(); // Gọi hàm thống kê từ khóa phổ biến
  const report = {
    totalPosts,
    totalUsers,
    totalVisits
  };

  res.render('index', {
    admin: admin,
    // blogs: blogs,
    // userLikedBlog: userLikedBlog
    report:report,
    popularKeywords:popularKeywords
  })
}
catch(err){
  console.log(err);
      req.flash('message', 'Something went wrong');
      req.flash('title', 'An error occurred while processing your request');
      req.flash('href', '/admin/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
}
}
async function countTotalVisits() {
  try {
    const totalVisits = await Visit.countDocuments();
    return totalVisits;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
async function listPopularKeywords() {
  try {
    const popularKeywords = await SearchKeyword.find()
      .sort({ count: -1 })
      .exec();
    return popularKeywords;
  } catch (error) {
    console.error(error);
    return [];
  }
}
exports.getcreateUser  = (req, res) => {
  const admin = req.session.admin;
  res.render('createUser',{
    admin: admin});
}
exports.postcreateUser = async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  const data = {
    username: req.body.username,
    password: hashPassword,
    email: req.body.email,
  };
  console.log(data);
  try {
    const checking = await User.findOne({ username: req.body.username });
   
    if (checking) {
        req.flash('message', 'This admin name has been taken, choose another one');
        req.flash('title', 'This admin name has already existed');
        req.flash('href', '/admin/createUser'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    } else {
      const defaultAvatarPath = path.join(__dirname,'../assets/profile2.jpg');
  
      data.avatarimg = {
        data: fs.readFileSync(defaultAvatarPath),
        contentType: 'image/jpeg' 
      };
  
      await User.create(data);
      const users = await User.find();
      // const newAdmin = await Admin.findOne({ adminname: req.body.adminname });
      res.render('indexPendingUser',{users:users});
    }
  } catch (error) {
        console.log(error);
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/admin/createUser'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
  }
  };
  exports.deleteBlog = async (req, res) => {
    const blogId = req.params.id; // Lấy blogId từ tham số trong URL
    // const AdminId = req.session.admin.id;
    
    try {
      // Tìm bài viết cần xóa trong cơ sở dữ liệu
      const blogToDelete = await Blog.findById(blogId);
     
      if (!blogToDelete) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      // Xóa bài viết
      await blogToDelete.remove();
      res.redirect(`/admin/pending-posts`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
  };
  exports.deleteUser = async (req, res) => {
    const userId = req.params.userId; // Lấy blogId từ tham số trong URL
    // const AdminId = req.session.admin.id;
    
    try {
      // Tìm bài viết cần xóa trong cơ sở dữ liệu
      const userToDelete = await User.findById(userId);
      console.log(userToDelete);
      if (!userToDelete) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Xóa bài viết
      await userToDelete.remove();
      res.redirect(`/admin/allUsers`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  };
  exports.deleteReports = async (req, res) => {
    const reportId = req.params.reportId; // Lấy blogId từ tham số trong URL
    // const AdminId = req.session.admin.id;
    
    try {
      // Tìm bài viết cần xóa trong cơ sở dữ liệu
      const reportToDelete = await Report.findById(reportId);
      console.log(reportToDelete);
      if (!reportToDelete) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Xóa bài viết
      await reportToDelete.remove();
      res.redirect(`/admin/reports`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting report', error: error.message });
    }
  };

  exports.getBlog = async (request, response) => {
    let blog = await Blog.findOne({ slug: request.params.slug })
    if (blog) {
  
        response.render('viewblog', { blog: blog});
        // Lưu thay đổi vào cơ sở dữ liệu
    } else {
        request.flash('message', 'Connot found this blog... why ?');
        request.flash('title', 'We wonder the same thing, why ?');
        request.flash('href', '/admin/home'); 
        response.render('error', {
            message: request.flash('message'),
            title: request.flash('title'),
            href: request.flash('href')
        });
    }
  }