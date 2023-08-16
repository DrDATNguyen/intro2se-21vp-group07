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


router.post('/new/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), adminController.postNewBlog);
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
      const reports = await Report.find();
      res.render('indexPendingReport', { reports:reports });
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
    const post = await Blog.findById(blogId);
    if (!post) {
      return res.status(404).send('Blog not found');
    }
    res.render('IndexPendingBlog', {pendingPosts:[post] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'+error.message);
  }
});
router.get('/allUsers', adminController.getAllUsers);
module.exports = router;
