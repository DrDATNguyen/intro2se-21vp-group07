const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const domPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);

mongoose.plugin(slug);
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
  },
  description: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  snippet: {
    type: String,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  video: {
    data: Buffer,
    contentType: String,
  },
  tags: {
      type: String,
  },

  slug: {
    type: String, 
    slug: 'title', 
    unique: true, 
    slug_padding_size: 2 
  },

  authorID:{
    type: String
  },
  isPremium:{
    type: Boolean,
    default: false
  },
  verify: {
    type: Boolean,
    default: false
},
  comments:[{
    authorID: String,
    content: String
  }]

  
});

(async () => {
  // Use dynamic import to get the ES module
  const stripHtmlModule = await import('string-strip-html');
  // Access the default export from the module
  const stripHtml = stripHtmlModule.default;

  blogSchema.pre('validate', function (next) {
    //check if there is a description
    if (this.description) {
      this.description = htmlPurify.sanitize(this.description);
      this.snippet = stripHtml(this.description.substring(0, 200)).result;
    }

    next();
  });
});
module.exports = mongoose.model('Blog', blogSchema);
