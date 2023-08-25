const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    avatarimg:{
        data: Buffer,
        contentType: String,
      }
  });
  
  const Admin = mongoose.model('Admin', adminSchema);
  
  module.exports = Admin;
  