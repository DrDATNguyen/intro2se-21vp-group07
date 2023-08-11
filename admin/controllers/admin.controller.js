const Blog = require('../models/blog.model'); // Thay đổi đường dẫn tới model của bạn
const User = require('../models/user'); 

exports.getPendingPosts = async (req, res) => {
    try {
        const pendingPosts = await Blog.find({ verify: false }); // Lấy các bài viết chưa được duyệt
        res.render('pending-posts', { pendingPosts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.approvePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Blog.findByIdAndUpdate(postId, { verify: true });
        res.render('pending-posts'); // Điều hướng sau khi duyệt
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ isUservip: false }); 
        res.render('pending-users', { pendingUsers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.approveUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const post = await User.findByIdAndUpdate(userId, { isUservip: true });
        const pendingUsers = await User.find({ isUservip: false }); 
        res.render('pending-users', { pendingUsers }); // Điều hướng sau khi duyệt
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
exports.listPopularKeywords = async (req, res) => {
    try {
      const popularKeywords = await SearchKeyword.find()
        .sort({ count: -1 }) // Sắp xếp từ nhiều xuống ít
        .exec();
  
      res.render('popular-keywords', { popularKeywords });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error listing popular keywords.');
    }
  }