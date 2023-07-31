const express = require('express');

//bring in mongoose
const mongoose = require('mongoose');

//bring in method override
const methodOverride = require('method-override');

const blogRouter = require('./routes/blogs');
const Blog = require('./models/Blog');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//connect to mongoose
mongoose.connect('mongodb+srv://datG:Dat123456@cluster0.kgivcxs.mongodb.net/', {
  useNewUrlParser: true, useUnifiedTopology: true,
  // useCreateIndex: true
})

//set template engine
app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
//route for the index
app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'public'))

// app.get('/', async (request, response) => {
//   let blogs = await Blog.find().sort({ timeCreated: 'desc' });

//   response.render('index', { blogs: blogs });
// });
app.get('/', async (request, response) => {
  try {
    let blogs = await Blog.find().sort({ createdAt: 'desc' });

    response.render('index', { blogs: blogs });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

// app.use(express.static('public'));
app.use('/blogs', blogRouter);

//listen port
app.listen(5001);
