const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();
const Blog = require('../models/blog.model'); // Thay đổi đường dẫn tới model của bạn
const User = require('../models/user'); 
const SearchKeyword = require('../models/searchKeyword'); // Đảm bảo bạn đã import model SearchKeyword
const Visit = require('../models/visit'); // Đảm bảo bạn đã import model SearchKeyword
const Report = require('../models/reports'); 
const path = require('path');
const { get } = require('http');
const multer = require('multer');
const Admin = require('../models/admin'); 
const fs = require('fs');

//define storage for the images
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 10000,
  },
});

router.get('/pending-posts', adminController.getPendingPosts);
router.post('/approve-post/:id', adminController.approvePost);
// router.get('/Statistics', async (req, res) => {
//     try {
//       const totalPosts = await Blog.countDocuments(); // Đếm tổng số bài viết
//       const totalUsers = await User.countDocuments(); // Đếm tổng số người dùng
//       // Giả sử bạn đã có một cơ chế lưu lượt truy cập và đếm số lượt truy cập
//       const totalVisits = await countTotalVisits(); // Đếm tổng số lượt truy cập
//       const popularKeywords = await listPopularKeywords(); // Gọi hàm thống kê từ khóa phổ biến
router.get('/new/:id', adminController.getNewBlog);


router.get('/createUser',  adminController.getcreateUser);
router.post('/createUser',  adminController.postcreateUser);
router.post('/new/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), adminController.postNewBlog);
router.get('/login',  adminController.getLogin);
router.post('/login',  adminController.postLogin);
router.get('/signup',  adminController.getSignup);
router.post('/signup',  adminController.postSignup);
router.post('/resetpassword/:id',async (req,res) =>{
  try{
      let admin = await Admin.findById(req.params.id);
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
      admin = await Admin.findByIdAndUpdate(admin._id,{password: req.body.ForgetPassword});
      res.redirect('/admin/login');
  }
  catch(err){
      req.flash('message', 'An error occurred');
      req.flash('title', 'Error');
      req.flash('href', '/admin/login');
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
      const forgetadminname = req.body.ForgetAdminname
      const admin = await Admin.findOne({ email: forget, adminname: forgetadminname });
      if (admin) {
          console.log(admin._id);
          res.render('resetpassword',{
              admin: admin,
          });
      } else {
          req.flash('message', 'Cannot find your account');
          req.flash('title', 'Cannot find your account, create one');
          req.flash('href', '/admin/login');
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
      req.flash('href', '/admin/login');
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
      res.redirect('/admin/login');
  });
});

//       const report = {
//         totalPosts,
//         totalUsers,
//         totalVisits
//       };
  
//       res.render('Statistics', { report,popularKeywords }); // Truyền report vào template
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Lỗi Server Nội Bộ');
//     }
//   });
  // async function countTotalVisits() {
  //   try {
  //     const totalVisits = await Visit.countDocuments();
  //     return totalVisits;
  //   } catch (error) {
  //     console.error(error);
  //     return 0;
  //   }
  // }
  // async function listPopularKeywords() {
  //   try {
  //     const popularKeywords = await SearchKeyword.find()
  //       .sort({ count: -1 })
  //       .exec();
  //     return popularKeywords;
  //   } catch (error) {
  //     console.error(error);
  //     return [];
  //   }
  // }
  router.get('/reports', async (req, res) => {
    try {
      const admin = req.session.admin;
      const reports = await Report.find();
      console.log('reports',reports);
      
      res.render('indexPendingReport', { reports:reports,admin:admin });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error'+ error.message);
    }
  });
  // router.get('/tables-pending', async (req, res) => {
  //   try {
  //     const reports = await Report.find();
  //     res.render('tables-pending', { reports });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Internal Server Error'+ error.message);
  //   }
  // });
  // Route để hiển thị thông tin chi tiết về một báo cáo cụ thể cho admin
// router.get('/reports/:reportId', async (req, res) => {
//   try {
//     const reportId = req.params.reportId;
//     const report = await Report.findById(reportId);
//     if (!report) {
//       return res.status(404).send('Report not found');
//     }
//     res.render('report-detail', { report });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error'+error.message);
//   }
// });

router.get('/reports/:blogId', async (req, res) => {
  try {
    // const report = await Report.find();
    const blogId = req.params.blogId;
    const admin = req.session.admin;
    const post = await Blog.findById(blogId);
    if (!post) {
      return res.status(404).send('Blog not found');
    }
    res.render('IndexPendingBlog', {pendingPosts:[post],admin:admin });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'+error.message);
  }
});
router.get('/allUsers', adminController.getAllUsers);
router.get('/home', adminController.getHome);
router.get('/getUserVisits', async (req, res) => {
  try {
    // Fetch user visit data from the database
    const userVisits = await Visit.find({}, 'timestamp').sort({ timestamp: 1 });

    // Calculate total visits per day
    const visitsPerDay = {};
    userVisits.forEach(visit => {
      const date = new Date(visit.timestamp).toLocaleDateString();
      if (!visitsPerDay[date]) {
        visitsPerDay[date] = 1;
      } else {
        visitsPerDay[date]++;
      }
    });

    // Prepare the data in the required format
    const userVisitsData = Object.keys(visitsPerDay).map(date => ({
      timestamp: new Date(date).getTime(),
      visits: visitsPerDay[date],
    }));

    // Send the data as JSON response
    res.json(userVisitsData);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:slug', adminController.getBlog);
router.post('/:id/delete', adminController.deleteBlog);
router.post('/:userId/deleteUser', adminController.deleteUser);
router.post('/:reportId/deleteReports', adminController.deleteReports);
module.exports = router;
