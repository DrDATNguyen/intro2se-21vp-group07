const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.routes');
const userRouter = require('./routes/user');
const Blog = require('./models/blog.model'); 
const User = require('./models/user'); 
const app = express();
const path = require('path');
app.set('view engine', 'ejs');
const session = require('express-session');
var flash = require('connect-flash');
// Kết nối tới cơ sở dữ liệu MongoDB
mongoose.connect('mongodb+srv://datG:Dat123456@cluster0.kgivcxs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Khai báo model và schema cho bài viết (nếu chưa có)
// const Blog = require('./models/blog.model');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
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
 
    res.render('login'); // Truyền report vào template
  
});

// Server lắng nghe cổng 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
