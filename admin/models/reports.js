const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // ... các trường khác của bài viết
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // ID người dùng báo cáo
    reportedBy: { type: String }, // ID người dùng bị báo cáo
    reportedAt: { type: Date, default: Date.now }, // Thời gian báo cáo
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'blogs' }, // ID bài viết
    reasons: [String], // Lý do báo cáo
    additionalDescription: String // Mô tả báo cáo thêm (tùy chọn)
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
