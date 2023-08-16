const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.routes');
const userRouter = require('./routes/user');
const Blog = require('./models/blog.model'); 
const User = require('./models/user'); 
const app = express();
const path = require('path');
const SearchKeyword = require('./models/searchKeyword'); // Đảm bảo bạn đã import model SearchKeyword
const Visit = require('./models/visit');
app.set('view engine', 'ejs');

// Kết nối tới cơ sở dữ liệu MongoDB
mongoose.connect('mongodb+srv://datG:Dat123456@cluster0.kgivcxs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Khai báo model và schema cho bài viết (nếu chưa có)
// const Blog = require('./models/blog.model');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('assets'));
app.set('views', path.join(__dirname, 'views'))
// Định tuyến cho phần admin
app.use('/admin', adminRoutes);
app.use('/user', userRouter);
// app.get('/', async (request, response) => {
//   try {
//     const pendingPosts = await Blog.find({ verify: false }); // Lấy các bài viết chưa được duyệt
//     const blogs = await Blog.find().sort({ createdAt: 'desc' }).limit(3);
//     const pendingUsers = await User.find({ isUservip: false });
//     response.render('pending-posts', { blogs, pendingPosts,pendingUsers }); // Truyền cả pendingPosts vào đây
//   } catch (error) {
//     // Xử lý lỗi nếu có
//     console.error(error);
//     response.status(500).send('Internal Server Error');
//   }
// });
app.get('/', async (req, res) => {
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

    res.render('index', { report,popularKeywords }); // Truyền report vào template
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
// Server lắng nghe cổng 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
