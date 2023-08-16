const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const Blog = require('../models/Blog');
const UserControllers = require('../controllers/userControllers')
const multer = require('multer');

const storage = multer.memoryStorage(); // Lưu trữ hình ảnh dưới dạng buffer
const upload = multer({
    storage: storage,
    limits: {
      fieldSize: 1024 * 1024 * 10000,
    },
  });


// const Article = require('../models/articlemodel')

router.get('/login', UserControllers.getLogin);
router.get('/index', UserControllers.getIndex);
router.post('/login', UserControllers.postLogin);
router.get('/signup', UserControllers.getSignup);
router.post('/signup', UserControllers.postSignup);
router.get('/home', UserControllers.getHome);

router.post('/resetpassword/:id', UserControllers.postResetPassword);

router.post('/forgetemail', UserControllers.postForgetEmail);

router.get('/forgetemail', UserControllers.getForgetEmail);

router.get('/logout', UserControllers.logOut);


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
router.post('/:id/editProfile',upload.single('image'), UserControllers.postEditProfile);
router.post('/:idUser/report/:idBlog', UserControllers.reportBlog);
router.get('/:idUser/report/:idBlog', UserControllers.getReport);

// router.get('/edit', (request, response) => {
//     res.render('edit');
//   })
// router.post('/:id/myBlogs', async (req, res) => {
//     try {
//         const userID = req.body.userID; 
//         console.log(userID);
//         const currentUser = await User.findById(userID);
//         console.log(userID); // Log the userID for debugging
        
//         const searchQuery = req.body.search; // Get the search query from the form data
//         const blogs = await Blog.find({ authorID: userID }).exec();
        

        
//         res.render('index', {
//           user: currentUser,
//           blogs: blogs
//         });
//       } catch (e) {
//         console.log(e);
//         res.status(500).send('Error searching for blogs.');
//       }
// })
router.get('/:id/myBlogs', UserControllers.getMyBlog);

router.get('/:userID/editBlogs/:blogID', UserControllers.userEditBlog);

router.put('/:userID/editBlogs/:blogID', UserControllers.putUserEditBlog);

router.get('/buy-premium/:blogId', UserControllers.getPremiumBlog);

router.post('/buy-premium/:blogId', UserControllers.buyPremiumBlog);
router.get('/add-to-cart/:blogId', UserControllers.addToCart);
router.get('/cart/:id', UserControllers.viewCart);
router.post('/buy-from-cart', UserControllers.buyFromCart);
router.post('/remove-from-cart/:blogId', UserControllers.removeFromCart);


router.get('/addmoney/:id', UserControllers.addMoneyToWallet);
router.post('/process-add-money', UserControllers.processAddMoney);

router.get('/upgrade/:id', async(req,res) =>{
  try{
    const user = await User.findById(req.params.id); 
    console.log(user);
    res.render('UpdateUser', {
      user: user,
    });
  }
  catch(err){
    console.log(err);
  }
});

router.get('/upgradeuser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.user_wallet < 50000) {
      return res.status(400).send('Insufficient funds');
    }

    // Update user data using User.updateOne()
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          isUservip: true,
          user_wallet: user.user_wallet - 50000,
        },
      }
    );

    res.redirect(`/user/${user._id}`) 
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});



module.exports = router;