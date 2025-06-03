const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({

  googleId: String,

  displayName: String,

  email: String,

  photo: String,

  isSubscribed: {

    type: Boolean,

    default: false, // false = Free user

  },

});



module.exports = mongoose.model('User', UserSchema);