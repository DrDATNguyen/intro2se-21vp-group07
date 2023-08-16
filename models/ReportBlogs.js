const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reports: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    reportedAt: { type: Date, default: Date.now }, 
    reasons: [String], 
    additionalDescription: String 
  }]
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
