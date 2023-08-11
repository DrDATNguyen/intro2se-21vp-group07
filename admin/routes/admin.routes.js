const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();
const Blog = require('../models/blog.model'); // Thay đổi đường dẫn tới model của bạn
const User = require('../models/user'); 
const SearchKeyword = require('../models/searchKeyword'); // Đảm bảo bạn đã import model SearchKeyword
const Visit = require('../models/visit'); // Đảm bảo bạn đã import model SearchKeyword

router.get('/pending-posts', adminController.getPendingPosts);
router.post('/approve-post/:id', adminController.approvePost);
router.get('/Statistics', async (req, res) => {
    try {
      const totalPosts = await Blog.countDocuments(); // Đếm tổng số bài viết
      const totalUsers = await User.countDocuments(); // Đếm tổng số người dùng
      // Giả sử bạn đã có một cơ chế lưu lượt truy cập và đếm số lượt truy cập
      const totalVisits = await countTotalVisits(); // Đếm tổng số lượt truy cập
      const popularKeywords = await listPopularKeywords(); // Gọi hàm thống kê từ khóa phổ biến

      const report = {
        totalPosts,
        totalUsers,
        totalVisits
      };
  
      res.render('Statistics', { report,popularKeywords }); // Truyền report vào template
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi Server Nội Bộ');
    }
  });
  async function countTotalVisits() {
    try {
      const totalVisits = await Visit.countDocuments();
      return totalVisits;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
  async function listPopularKeywords() {
    try {
      const popularKeywords = await SearchKeyword.find()
        .sort({ count: -1 })
        .exec();
      return popularKeywords;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
module.exports = router;
