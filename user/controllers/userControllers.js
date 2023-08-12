const User = require('../models/usermodel');
const Blog = require('../models/Blog');
const Report = require('../models/ReportBlogs');
const fs = require('fs');
const path = require('path');

exports.getLogin = (req, res) => {
    res.render('login');
}
exports.getReport = async (req, res) => {
  try {
    const userId = req.params.idUser;
    const blogId = req.params.idBlog;

    // Sử dụng Promise.all để chờ cả hai lệnh findById hoàn thành
    const [user, blog] = await Promise.all([
      User.findById(userId).exec(),
      Blog.findById(blogId).exec()
    ]);

    if (!user) {
      return res.status(404).send('Người dùng không tồn tại');
    }

    if (!blog) {
      return res.status(404).send('Bài viết không tồn tại');
    }

    res.render('report', { user, blog }); // Truyền user và blog vào template
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
};

exports.getIndex = (req, res) => {
    res.render('index');
}

exports.postLogin = async (req, res) => {
    try {
      //if (req.body.username === "admin" && req.body.password === "admin123") {} // render admin page
      const user = await User.findOne({ username: req.body.username });
      if (user && user.password === req.body.password) {
        //const Blogs = await Blog.find(); // Wait for the articles to be fetched
        const Blogs = await Blog.find().sort({ createdAt: 'desc' }); // Lấy 3 bài viết mới nhất
        res.render('index', {
          user: user,
          blogs: Blogs
        });
      } else {
        res.render('login');
      }
    } catch (error) {
      res.send("An error occurred while processing your request");
    }
}

exports.getSignup = (req, res) => {
    res.render('signup');
}

exports.postSignup = async (req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const checking = await User.findOne({ username: req.body.username });

    if (checking) {
      // User already exists, render an error message.
      res.send("User details already exist.");
    } else {
      // User doesn't exist, insert into the database.
      const defaultAvatarPath = path.join(__dirname,'../assets/profileUserCard.jpg');

      data.avatarimg = {
        data: fs.readFileSync(defaultAvatarPath),
        contentType: 'image/jpeg' // Replace with the actual content type of the image
      };

      await User.create(data);
      // Retrieve the user data again after insertion.
      const newUser = await User.findOne({ username: req.body.username });
      // const Blogs = await Blog.find({ verify: true }).sort({ createdAt: 'desc' }).limit(2);
      // Render the "login.ejs" view with the newly created user data.
      // const articles = await Article.find(); // Assuming you have an "Article" model
      res.render('login', {
        user: newUser,
        // blogs: Blogs
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process.
    res.send("Something went wrong."+ error.message);
  }
};

exports.getHome = async (req,res) =>{
    try{
      const userID = req.params.id;
      const user = await User.findById(userID);
      // const blog = await Blog.find();
      const blog = await Blog.find().sort({ createdAt: 'desc' }).limit(1); // Lấy 3 bài viết mới nhất
      res.render('index',{
        user: user,
        blogs: blog
      })
    }
    catch(error){
        console.log(error);
    }
}

exports.getProfile = async (req, res) => {
    try {
      const userID = req.params.id;
      const currentUser = await User.findById(userID); // Await the async function
      // const blog = await Blog.find()
      const blog = await Blog.find().sort({ createdAt: 'desc' }).limit(1); // Lấy 3 bài viết mới nhất;
      console.log(blog);

      res.render('MenuUser2', {
        user: currentUser,
        blogs: blog
      });
    } catch (error) {
      console.log(error);
      res.send("An error occurred while processing your request");
    }
}

exports.getEditProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        // Handle the case where the user is not found
        return res.status(404).send('User not found');
      }
      res.render('ProfileSetting', { user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
}

exports.postEditProfile = async (req, res) => {
  try {
      req.user = await User.findById(req.params.id);
      let user = req.user;
      const userId = req.params.id;
      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;
      const avatarImg = req.file

      console.log('User ID:', user);
      console.log('Username:', username);
      console.log('Password:',  password);
      console.log('Email:', email);
      console.log('Avatar Image:', avatarImg);

      // Tạo một đối tượng để cập nhật
      const updatedFields = {
          username: username,
          password: password,
          email: email,
      };

      // Kiểm tra điều kiện và thêm thuộc tính avatar nếu có
      if (avatarImg) {
        updatedFields.avatarimg = {
          data: avatarImg.buffer,
          contentType: avatarImg.mimetype
      };
      console.log('Received avatar image data:', avatarImg);
      }
      console.log('No avatar image data received');
      // Sử dụng đối tượng updatedFields để cập nhật
      newuser = await User.findByIdAndUpdate(user, updatedFields);

      console.log(newuser);

      const Blogs = await Blog.find().sort({ createdAt: 'desc' }).limit(1);; // Wait for the articles to be fetched
      res.render('MenuUser2', {
          user: newuser,
          blogs: Blogs
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error'+ err.message);
  }

};
exports.reportBlog = async (req, res) => {
  try {
    // Tìm người dùng dựa vào ID trong URL
    const user = await User.findById(req.params.idUser);

    if (!user) {
      return res.status(404).send('Người dùng không tồn tại');
    }

    const blogId = req.params.idBlog; // ID của bài viết
    const userId = user._id; // ID người dùng báo cáo
    const reportReasons = req.body.reportReasons; // Mảng lý do báo cáo
    const additionalDescription = req.body.additionalDescription; // Mô tả báo cáo thêm (tùy chọn)
    // const user = await User.findById(userId);
    const blog = await Blog.findById(blogId);
    // Tạo một bản ghi mới trong collection "reports"
    const report = new Report({
      user: userId,
      reportedBy: blog.author, // ID người viết bài
      blog: blogId,
      reasons: reportReasons,
      additionalDescription: additionalDescription
    });

    await report.save();
      // Lấy thông tin user và blog từ cơ sở dữ liệu
    res.render('report', { user, blog }); // Truyền user và blog vào template
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi Server Nội Bộ');
  }
};

