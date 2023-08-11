const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    introduction: {
        type: String
    },
    description: {
        type: String
    },
    verify: {
        type: Boolean,
        default: false
    },
    // Các trường khác của bài viết
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
