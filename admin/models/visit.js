const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;