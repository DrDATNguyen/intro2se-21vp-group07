const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const Blog = require('../models/Blog');
const UserControllers = require('../controllers/userControllers')

// const Article = require('../models/articlemodel')

router.get('/login', UserControllers.getLogin);
router.get('/index', UserControllers.getIndex);
router.post('/login', UserControllers.postLogin);
router.get('/signup', UserControllers.getSignup);
router.post('/signup', UserControllers.postSignup);
router.get('/home/:id', UserControllers.getHome);


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

router.get('/:id', UserControllers.getProfile);
router.get('/:id/editProfile', UserControllers.getEditProfile);
router.post('/:id/editProfile', UserControllers.postEditProfile);

module.exports = router;