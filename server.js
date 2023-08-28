const express = require('express');
const session = require('express-session');
var flash = require('connect-flash');
//bring in mongoose
const mongoose = require('mongoose');

//bring in method override
const BlogControllers = require('./controllers/blogControllers')
const methodOverride = require('method-override');
const userRouter = require('./routes/userrouter');
const blogRouter = require('./routes/blogsrouter');
const Blog = require('./models/Blog');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'assets')));
const Visit = require('./models/visit');
//connect to mongoose
mongoose.connect('mongodb+srv://khangvadat:khangvadatdeptrai@webdeveloppersgroup07.t4puhcs.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true,
  useCreateIndex: true
},
() =>{
  console.log("Connected to MongoDB");
});


//set template engine
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'))
app.set('font-users', path.join(__dirname, 'font-users'))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (request, response) => {
  try {
    let Blogs = await Blog.find({ verify: true }).sort({ createdAt: 'desc' });
    const filteredBlogs = await BlogControllers.filterBlogs('mostPopular').limit(5);
    response.render('../font-users/main', { blogs: Blogs,popularblogs:filteredBlogs });
    await createVisit();

  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});
async function createVisit() {
  try {
    const newVisit = new Visit();
    await newVisit.save();
  } catch (error) {
    console.error(error);

  }
}

// app.use(express.static('public'));
app.use('/blogs', blogRouter);
app.use('/user', userRouter);
//listen port
app.listen(3000);
