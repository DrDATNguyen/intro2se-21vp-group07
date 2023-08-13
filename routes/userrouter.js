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
router.get('/:id/myBlogs', async (req, res) => {
    try {
        const userID =  req.params.id;
        console.log(userID);
        const currentUser = await User.findById(userID);
        console.log(userID); // Log the userID for debugging
        
        // const searchQuery = req.body.search; // Get the search query from the form data
        // const blogs = await Blog.find({ authorID: userID }).exec();
        const Blogs = await Blog.find().sort({ createdAt: 'desc' }).limit(1);

        
        res.render('MenuUser2', {
          user: currentUser,
          blogs: Blogs
        });
      } catch (e) {
        console.log(e);
        res.status(500).send('Error searching for blogs.');
      }
})

router.get('/:userID/editBlogs/:blogID', async (req, res) => {
    const userID = req.params.userID;
    console.log(userID);
    const blogID = req.params.blogID;
    console.log(blogID );
    const currentUser = await User.findById(userID);
    const blog = await Blog.findById(blogID);

    if (currentUser && blog) {
        res.render('edit', { user: currentUser, blog: blog });
    } else {
        res.status(404).send('User or blog not found');
    }
});

router.put('/:userID/editBlogs/:blogID', async (req, res) => {

    try {
        const blogId = req.params.blogID;
        const updatedData = {
            title: req.body.title,
            author: req.body.author,
            introduction: req.body.introduction,
            description: req.body.description,
            img: req.body.img,
            video: req.body.video,
            tags: req.body.tags
        };

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, { new: true });

        if (updatedBlog) {
            res.redirect(`/blogs/${updatedBlog.slug}`);
        } else {
            res.status(404).send('Blog not found');
        }
    } catch (error) {
        console.log(error);
        res.redirect(`/user/${req.params.userID}/editBlogs/${req.params.blogID}`, { blog: req.body });
    }
})

router.get('/buy-premium/:blogId', async(req,res) => {
    const currentBlog = await Blog.findById(req.params.blogId);
    res.render('CheckOut', {
        blog: currentBlog,
    });
});

router.post('/buy-premium/:blogId', UserControllers.buyPremiumBlog);
router.get('/add-to-cart/:blogId', UserControllers.addToCart);
router.get('/cart', UserControllers.viewCart);

router.get('/add-money', UserControllers.addMoneyToWallet);
router.post('/process-add-money', UserControllers.processAddMoney);


module.exports = router;