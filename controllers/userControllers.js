const User = require('../models/usermodel');
const Blog = require('../models/Blog');
const Cart = require('../models/cart')
const Report = require('../models/ReportBlogs');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');


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
        req.flash('message', 'Cannot find your account');
        req.flash('title', 'Cannot find your account, create one');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }

    if (!blog) {
      req.flash('message', 'This blog cannot be found');
        req.flash('title', 'Cannot find the id of this blog, try again next time');
        req.flash('href', '/user/home'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
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
      if (user && user.password === req.body.password) {
        
        req.session.user = user;
        console.log('User logged in:', req.session.user);
        res.redirect('/user/home');
      } else {
        req.flash('message', 'You have entered the wrong password');
        req.flash('title', 'Wrong Password');
        req.flash('href', '/user/login'); 
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
      req.flash('href', '/user/login'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
    }
}

exports.logOut = (req,res) =>{
  req.session.destroy(() => {
      res.redirect('/user/login');
  });
}

exports.getSignup = (req, res) => {
    res.render('signup');
}

exports.postSignup = async (req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  try {
    const checking = await User.findOne({ username: req.body.username });

    if (checking) {
        req.flash('message', 'This user name has been taken, choose another one');
        req.flash('title', 'This user name has already existed');
        req.flash('href', '/user/signup'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    } else {
      const defaultAvatarPath = path.join(__dirname,'../assets/profileUserCard.jpg');

      data.avatarimg = {
        data: fs.readFileSync(defaultAvatarPath),
        contentType: 'image/jpeg' 
      };

      await User.create(data);
      const newUser = await User.findOne({ username: req.body.username });
      res.render('login', {
        user: newUser,
      });
    }
  } catch (error) {
        console.log(error);
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
  }
};

exports.postForgetEmail = async (req,res) =>{
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
}

exports.getForgetEmail = (req,res) =>{
  res.render('forgetpassword1');
}

exports.postResetPassword = async (req,res) =>{
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
}

exports.getHome = async(req,res) =>{
  try{
    const user = await User.findById(req.session.user._id);
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

exports.getProfile = async (req, res) => {
    try {
      const userID = req.params.id;
      const currentUser = await User.findById(userID); 
      const blog = await Blog.find().sort({ createdAt: 'desc' }).limit(1); 

      res.render('MenuUser2', {
        user: currentUser,
        blogs: blog
      });

    } catch (error) {
      console.log(error);
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

exports.getEditProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        req.flash('message', 'Cannot find your account');
        req.flash('title', 'Cannot find your account, create one');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
      }
      res.render('ProfileSetting', { user });
    } catch (err) {
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

exports.postEditProfile = async (req, res) => {
  try {
      req.user = await User.findById(req.params.id);

      if (!user) {
        req.flash('message', 'Cannot find your account');
        req.flash('title', 'Cannot find your account, create one');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
      }

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
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
  }

};

exports.reportBlog = async (req, res) => {
  try {
    const user = await User.findById(req.params.idUser);

    if (!user) {
        req.flash('message', 'Cannot find your account');
        req.flash('title', 'Cannot find your account, create one');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
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
        req.flash('message', 'Something went wrong');
        req.flash('title', 'An error occurred while processing your request');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
  }
};

exports.getMyBlog = async (req, res) => {
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

exports.userEditBlog = async (req, res) => {
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
}

exports.putUserEditBlog = async (req, res) => {

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
}

exports.getPremiumBlog = async(req,res) => {
  const currentBlog = await Blog.findById(req.params.blogId);
  console.log(currentBlog);
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
}

exports.buyPremiumBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog || !blog.isPremium) {
        req.flash('message', 'Premium blog cannot be found');
        req.flash('title', 'Cannot find your account, create one');
        req.flash('href', '/user/home'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }

    // Assuming user is available in the session
    const user = req.session.user;
    console.log(user);
    if (user.user_wallet < blog.price) {
      req.flash('message', 'You have no money man ! Sadly. It is not enough to buy this beautiful blog');
      req.flash('title', 'You are poor');
      req.flash('href', '/user/home'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
    }

    user.user_wallet -= blog.price;
    user.bought_blog.push(blog._id);
    await User.findByIdAndUpdate(user._id, user);

    res.redirect('/user/home');
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
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const blogId = req.params.blogId;
    Cart.findOneAndUpdate(
      { user: userId },
      { $addToSet: { blogs: blogId } },
      { new: true, upsert: true }
    )
      .populate('blogs')
      .exec(async (err, cart) => {
        if (err) {
          console.error(err);
          req.flash('message', 'Something went wrong');
          req.flash('title', 'An error occurred while processing your request');
          req.flash('href', '/user/login'); 
          res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
          });
          return;
        }

        if (!cart) {

          const newCart = new Cart({ user: userId, blogs: [blogId] });
          await newCart.save();
          console.log('Created new cart:', newCart);
          res.render('cartView', { cart: newCart }); // Render with new cart
        } else {
          console.log('Updated cart:', cart);
          res.render('cartView', { cart: cart }); // Render with updated cart
        }
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
};


  exports.viewCart = async (req, res) => {
    try {
      // Assuming user is available in the session
      const user = await User.findById(req.params.id);
      console.log(user);
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
      let cart = await Cart.findOne({ user: user._id }).populate('blogs');
      console.log('Found Cart:', cart);
      res.render('cartView', { cart });
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
  };

exports.buyFromCart = async (req, res) => {
  try {
    // Assuming user is available in the session
    const user = req.session.user;
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
        req.flash('message', 'Cannot find your account');
        req.flash('title', 'Cannot find your account, create one');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }

    const cart = await Cart.findOne({ user: user._id }).populate('blogs');
    if (!cart) {
        req.flash('message', 'Where is your cart ? We dont know either :D Sadly, create another account then :))');
        req.flash('title', 'Where is your cart ?');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }

    // Calculate total price of the blogs in the cart
    let totalCost = 0;
    for (const blog of cart.blogs) {
      totalCost += blog.price;
    }

    // Check if user has enough funds in user_wallet
    if (user.user_wallet < totalCost) {
      req.flash('message', 'You have no money man ! Sadly. It is not enough to buy all of this items. Remove some of them or add more to your wallet');
      req.flash('title', 'You are poor');
      req.flash('href', '/user/home'); 
      res.render('error', {
          message: req.flash('message'),
          title: req.flash('title'),
          href: req.flash('href')
      });
    }

    // Deduct the total cost from user's wallet
    const newWalletAmount = user.user_wallet - totalCost;
    await User.findByIdAndUpdate(user._id, { $set: { user_wallet: newWalletAmount } });

    // Add unique blogs from the cart to user's bought_blog array
    const uniqueBlogIds = cart.blogs.map(blog => blog._id);
    await User.updateOne({ _id: user._id }, { $addToSet: { bought_blog: { $each: uniqueBlogIds } } });
    req.session.user.user_wallet = newWalletAmount;
    req.session.user.bought_blog = [...req.session.user.bought_blog, ...uniqueBlogIds];
    // Clear the cart
    cart.blogs = [];
    await cart.save();

    res.redirect('/user/home');
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
};

exports.removeFromCart = async (req, res) => {
  try {
    // Assuming user is available in the session
    const user = req.session.user;
  
  // Find the user's cart and use $pull to remove the specified blog
  const blogIdToRemove = req.params.blogId;
  const updatedCart = await Cart.findOneAndUpdate(
    { user: user._id },
    { $pull: { blogs: blogIdToRemove } },
    { new: true }
  ).populate('blogs');
  
  if (!updatedCart) {
        req.flash('message', 'Where is your cart ? We dont know either :D Sadly, create another account then :))');
        req.flash('title', 'Where is your cart ?');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
  }

    res.redirect(`/user/cart/${user._id}`); // Redirect back to the cart view
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
};


exports.addMoneyToWallet = async (req, res) => {
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
};


exports.processAddMoney = async (req, res) => {
  try {
    const user = req.session.user;

    const amount = parseFloat(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
        req.flash('message', 'Wow.... Just wow!!!');
        req.flash('title', 'You wanna add a negative number to your wallet ?');
        req.flash('href', '/user/home'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }

    // Update the user's wallet with the new amount
    await User.updateOne({ _id: user._id }, { $inc: { user_wallet: amount } });

    // Redirect back to user's home page
    res.redirect('/user/home');
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
};


