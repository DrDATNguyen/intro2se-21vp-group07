const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const Blog = require('../models/Blog');

// const Article = require('../models/articlemodel')

router.get('/login', (req, res) => {
  res.render('login');
});

// router.get('/homeUser', (req, res) => {
//   res.render('homeUser');
// });


router.post('/login', async (req, res) => {
  try {
    //if (req.body.username === "admin" && req.body.password === "admin123") {} // render admin page
    const user = await User.findOne({ username: req.body.username });
    console.log('Username:', req.body.username);
    console.log('Password:', req.body.password);
    console.log(user);
    if (user && user.password === req.body.password) {
      const Blogs = await Blog.find(); // Wait for the articles to be fetched
      res.render('index', {
        user: user,
        blogs: [Blogs]
      });
    } else {
      res.render('login');
    }
  } catch (error) {
    res.send("An error occurred while processing your request");
  }
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
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
});





// Define a new GET route for editing the user's profile
// router.get('/:id/edit', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if (!user) {
//       // Handle the case where the user is not found
//       return res.status(404).send('User not found');
//     }
//     res.render('editProfile', { user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });


// // Assuming you already have the following route to handle editing the user's profile
// router.post('/:id/edit', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { username, password, email, avatarimg } = req.body;

//     // Find the user by ID and update the fields
//     newuser = await User.findByIdAndUpdate(userId, { username, password, email, avatarimg });
//     const articles = await Article.find(); // Wait for the articles to be fetched
//       res.render('homeUser', {
//         user: newuser,
//         articles: [articles]
//       });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });


module.exports = router;