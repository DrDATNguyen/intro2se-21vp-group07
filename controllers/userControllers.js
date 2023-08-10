const User = require('../models/usermodel');
const Blog = require('../models/Blog');

exports.getLogin = (req, res) => {
    res.render('login');
}

exports.getIndex = (req, res) => {
    res.render('index');
}

exports.postLogin = async (req, res) => {
    try {
      //if (req.body.username === "admin" && req.body.password === "admin123") {} // render admin page
      const user = await User.findOne({ username: req.body.username });
      if (user && user.password === req.body.password) {
        //const Blogs = await Blog.find(); // Wait for the articles to be fetched
        const Blogs = await Blog.find().sort({ createdAt: 'desc' }).limit(1); // Lấy 3 bài viết mới nhất
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
      password: req.body.password
    }
  
    try {
      const checking = await User.findOne({ username: req.body.username });
  
      if (checking) {
        // User already exists, render an error message.
        res.send("User details already exist.");
      } else {
        // User doesn't exist, insert into the database.
        await User.create(data);
        // Retrieve the user data again after insertion.
        const newUser = await User.findOne({ username: req.body.username });
        // Render the "homeUser.ejs" view with the newly created user data.
        // const articles = await Article.find(); // Assuming you have an "Article" model
        res.render('../font-users/main', {
          user: newUser,
          // articles: articles
        });
      }
    } catch (error) {
      // Handle any errors that occur during the process.
      res.send("Something went wrong.");
    }
}

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
      const userId = req.params.id;
      const user = req.body.username;
      const pass = req.body.password;
      const mail = req.body.email;
      console.log(req.body);
      newuser = await User.findByIdAndUpdate(userId, {
         username: user,
         password: pass,
         email: mail
      });
      console.log(newuser);
      const Blogs = await Blog.find(); // Wait for the articles to be fetched
        res.render('index', {
          user: newuser,
          blogs: Blogs
        });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
}