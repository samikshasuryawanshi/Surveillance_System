const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  subscribed: { type: Boolean, default: false }
});
module.exports = mongoose.model('User', UserSchema);
