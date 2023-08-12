const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  avatarimg:{
      data: Buffer,
      contentType: String,
    },
  isUservip:{
    type: Boolean,
    default: false
  },
  user_wallet:{
    type: Number,
    false: 0
  },
  bought_blog:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
