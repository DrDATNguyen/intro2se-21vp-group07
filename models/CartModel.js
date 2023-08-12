const mongoose = require('mongoose');


const User = mongoose.model('Cart', cartSchema);

module.exports = User;
