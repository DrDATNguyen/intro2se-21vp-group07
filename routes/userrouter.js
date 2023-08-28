const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const Blog = require('../models/Blog');
const UserControllers = require('../controllers/userControllers')
const multer = require('multer');
const paypal = require('paypal-rest-sdk');
const bcrypt = require('bcrypt');


paypal.configure({
    'mode': 'sandbox', 
    'client_id': 'AfUgUZ4zRIZo-DsJ-Uk8fyq8688Qq4DQ8yVq7d7UBlgm6H2OYBOclnGnPVWUangAyW7FKdMdJKRp9Abt',
    'client_secret': 'EBidcgHSUhN4t-H3oqC-7QCcbbdH16q0xLLF6TMbKQuYbVWJYCfLUz-VgM_ht61manJRwaEMJWza2LHb'
  });

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
router.get('/contact', UserControllers.getContact);
router.get('/about', UserControllers.getAbout);

router.post('/resetpassword/:id',async (req,res) =>{
    try{
        let user = await User.findById(req.params.id);
        if(!user){
                req.flash('message', 'Cannot find your account');
                req.flash('title', 'Cannot find your account, create one');
                req.flash('href', '/user/login');
                res.render('error', {
                    message: req.flash('message'),
                    title: req.flash('title'),
                    href: req.flash('href')
                });
        }
        user = await User.findByIdAndUpdate(user._id,{password: req.body.ForgetPassword});
        res.redirect('/user/login');
    }
    catch(err){
        req.flash('message', 'An error occurred');
        req.flash('title', 'Error');
        req.flash('href', '/user/login');
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
});
router.post('/forgetemail', async (req,res) =>{
    try{
        const forget = req.body.ForgetEmail;
        const forgetUsername = req.body.ForgetUsername
        const user = await User.findOne({ email: forget, username: forgetUsername });
        if (user) {
            console.log(user._id);
            res.render('resetpassword',{
                user: user,
            });
        } else {
            req.flash('message', 'Cannot find your account');
            req.flash('title', 'Cannot find your account, create one');
            req.flash('href', '/user/login');
            res.render('error', {
                message: req.flash('message'),
                title: req.flash('title'),
                href: req.flash('href')
            });
        }
    } catch (err) {
        console.log(err);
        req.flash('message', 'An error occurred');
        req.flash('title', 'Error');
        req.flash('href', '/user/login');
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
});

router.get('/forgetemail', (req,res) =>{
    res.render('forgetpassword1');
});

router.get('/logout',(req,res) =>{
    req.session.destroy(() => {
        res.redirect('/user/login');
    });
});


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


router.get('/:id', UserControllers.getProfile);
router.get('/:id/editProfile', UserControllers.getEditProfile);
router.post('/:id/editProfile',upload.single('image'), UserControllers.postEditProfile);
router.post('/:idUser/report/:idBlog', UserControllers.reportBlog);
router.get('/:idUser/report/:idBlog', UserControllers.getReport);

router.get('/:id/myBlogs', async (req, res) => {
    try {
        const userID =  req.params.id;
        console.log(userID);
        const currentUser = await User.findById(userID);
        console.log(userID); // Log the userID for debugging
        
        // const searchQuery = req.body.search; // Get the search query from the form data
        // const blogs = await Blog.find({ authorID: userID }).exec();
        const Blogs = await Blog.find({ authorID: userID }).sort({ createdAt: 'desc' }).limit(1);

        
        res.render('MenuUser2', {
          user: currentUser,
          boughtBlogs: Blogs
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
        req.flash('message', 'User or blog cannot be found. Well... just to be sure, get back to login man');
        req.flash('title', 'Where is my blog');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
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
    if(!currentBlog){
        req.flash('message', 'We dont know man, we actually dont know');
        req.flash('title', 'Where is my blog');
        req.flash('href', '/user/home'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
    res.render('CheckOut', {
        blog: currentBlog,
    });
});

router.post('/buy-premium/:blogId', UserControllers.buyPremiumBlog);
router.get('/add-to-cart/:blogId', UserControllers.addToCart);
router.get('/cart/:id', UserControllers.viewCart);
router.post('/buy-from-cart', UserControllers.buyFromCart);
router.post('/remove-from-cart/:blogId', UserControllers.removeFromCart);
router.get('/addmoney/:id', async (req, res) => {
  try {
    // Assuming user is available in the session
    const user = await User.findById(req.params.id);

    // Render the add money to wallet form
    res.render('addMoneyView', { user });
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
});


router.get('/success/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const paymentId = req.query.paymentId;
      const payerId = req.query.PayerID;
      const paymentAmount = parseFloat(req.session.paymentAmount);
  
      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: 'USD',
              total: paymentAmount
            }
          }
        ]
      };
  
      const user = await User.findById(userId);
      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            user.user_wallet += paymentAmount;
        }
    });
    
      const updateResult = await User.updateOne(
        { _id: userId },
        {
          $inc: { user_wallet: paymentAmount },
        }
    );
      const newuser = await User.findById(req.session.user._id);
      const blogs = await Blog.find().sort({ createdAt: 'desc' });
      req.session.user = newuser;
      res.redirect('/user/home');
  
    } catch (error) {
      console.error(error);
      // Handle the error
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    };
  });
  
  router.post('/process-add-money', (req, res) => {
    const amount = req.body.amount; // Get the amount from the form
    const currency = req.body.currency; // Get the currency from the form
  
    // Save the payment amount to session
    req.session.paymentAmount = amount;
    req.session.userId = req.session.user._id;
    const userId = req.session.user._id;
  
    const paymentData = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `http://localhost:3000/user/success/${userId}`,
        cancel_url: 'http://localhost:3000/user/home'  // Modify this URL
      },
      transactions: [{
        amount: {
          currency: currency,
          total: amount
        },
        description: 'Adding money to wallet'
      }]
    };
  
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        console.log(error);
        // Handle the error
      } else {
        console.log(payment);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            // Redirect the user to PayPal for approval
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  });
  
router.get('/:blogId', async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);

        if (!blog) {
          req.flash('message', 'User or blog cannot be found. Well... just to be sure, get back to login man');
          req.flash('title', 'Where is my blog');
          req.flash('href', '/user/login'); 
          res.render('error', {
              message: req.flash('message'),
              title: req.flash('title'),
              href: req.flash('href')
          });
        }

        // Đoạn mã để kiểm tra xem người dùng đã like bài viết hay chưa
        const userLikedBlog = blog.likes.includes(userId); // userId là ID của người dùng hiện tại

        res.render('blog', {
            blog: blog,
            
        });
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
});

router.post('/like/:blogId/:userId', async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const userId = req.params.userId;

        const blog = await Blog.findById(blogId);

        if (!blog) {
          req.flash('message', 'User or blog cannot be found. Well... just to be sure, get back to login man');
          req.flash('title', 'Where is my blog');
          req.flash('href', '/user/login'); 
          res.render('error', {
              message: req.flash('message'),
              title: req.flash('title'),
              href: req.flash('href')
          });
        }

        const userLikedIndex = blog.likedBy.indexOf(userId);
        if (userLikedIndex === -1) {
            // Người dùng chưa thích, thêm vào mảng likedBy và tăng likes
            blog.likedBy.push(userId);
            blog.likes = blog.likes + 1;
        } else {
            // Người dùng đã thích, bỏ khỏi mảng likedBy và giảm likes
            blog.likedBy.splice(userLikedIndex, 1);
            blog.likes = blog.likes - 1;
        }

        await blog.save();

        res.json({ likes: blog.likes });
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
});

router.post('/:blogId/deleteBoughtBlog/:userId', UserControllers.deleteBoughtBlog);


module.exports = router;