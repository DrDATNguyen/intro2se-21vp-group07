const Blog = require('../models/blog.model'); // Thay đổi đường dẫn tới model của bạn
const User = require('../models/user'); 

exports.getPendingPosts = async (req, res) => {
    try {
        const pendingPosts = await Blog.find({ verify: false }); // Lấy các bài viết chưa được duyệt
        res.render('IndexPendingBlog', { pendingPosts:pendingPosts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.approvePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Blog.findByIdAndUpdate(postId, { verify: true });
        const pendingPosts = await Blog.find({ verify: false });
        res.render('IndexPendingBlog',{ pendingPosts:pendingPosts }); // Điều hướng sau khi duyệt
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.gettablespendingUser = async (req, res) => {
    try {
        const pendingUsers = await User.find({ isUservip: false }); 
        res.render('tables-pending', { pendingUsers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.approvetablespendingUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const post = await User.findByIdAndUpdate(userId, { isUservip: true });
        // const pendingUsers = await User.find({ isUservip: false }); 
        const users = await User.find();
        res.render('indexPendingUser', { users:users }); // Điều hướng sau khi duyệt
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
  exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Lấy danh sách tất cả người dùng

        // Render trang hiển thị danh sách người dùng
        res.render('indexPendingUser', { users:users }); // Thay đổi tên view và biến context tùy theo yêu cầu của bạn
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
exports.getNewBlog = async (request, response) => {
    const userID = request.params.id;
    console.log(userID);
    const currentUser = await User.findById(userID);
    if(currentUser){
      console.log(currentUser);
    }
    else{
        req.flash('message', 'You have logged in and still see this error ? Well... Ooops');
        req.flash('title', 'Who are you');
        req.flash('href', '/user/login'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
    response.render('new', {users: currentUser});
}
exports.postNewBlog = async (req, res) => {
    try {
      const { title, author,introduction, description,tags } = req.body;
      const imageFile = req.files['image'];
      const videoFile = req.files['video'];
      const authorID = req.params.id;
      const price = parseInt(req.body.price);
      console.log(price);
      let isPremium = false;
      if(price > 0){
        isPremium = true;
      }
    
      
      const newBlog = new Blog({
        title,
        author,
        introduction,
        description,
        authorID,
        tags: tags.split(',').map(tag => tag.trim()).join(', '),
        price: price,
        isPremium: isPremium
      });
  
      if (imageFile && imageFile[0]) {
        console.log('Image buffer size:', imageFile[0].buffer.length);
        newBlog.img = {
          data: imageFile[0].buffer,
          contentType: imageFile[0].mimetype,
        };
      }
      
      if (videoFile && videoFile[0]) {
        console.log('Video buffer size:', videoFile[0].buffer.length);
        newBlog.video = {
          data: videoFile[0].buffer,
          contentType: videoFile[0].mimetype,
        };
      }
  
      await newBlog.save();
      res.redirect(`/blogs/${newBlog.slug}`);
    } catch (error) {
      console.log(error);
        req.flash('message', 'Yeah... something that can happen too...');
        req.flash('title', 'An error occurred while uploading your data');
        req.flash('href', '/user/home'); 
        res.render('error', {
            message: req.flash('message'),
            title: req.flash('title'),
            href: req.flash('href')
        });
    }
}