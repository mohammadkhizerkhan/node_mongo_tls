const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI;

mongoose.connect(mongoUrl,{
  
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a User schema

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true }
});

// Create a User model
const User = mongoose.model('User', UserSchema);

module.exports = {User};
