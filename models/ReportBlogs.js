const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // ... các trường khác của bài viết
  reports: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID người dùng báo cáo
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID người dùng báo cáo
    reportedAt: { type: Date, default: Date.now }, // Thời gian báo cáo
    reasons: [String], // Lý do báo cáo
    additionalDescription: String // Mô tả báo cáo thêm (tùy chọn)
  }]
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
