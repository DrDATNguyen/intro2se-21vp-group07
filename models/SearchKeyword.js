const mongoose = require('mongoose');

const searchKeywordSchema = new mongoose.Schema({
  keyword: String,
  count: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now }
});

const SearchKeyword = mongoose.model('SearchKeyword', searchKeywordSchema);

module.exports = SearchKeyword;
