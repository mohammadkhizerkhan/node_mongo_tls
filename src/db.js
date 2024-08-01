
// import mongoose, { Schema, model } from 'mongoose';
const mongoose = require('mongoose');


const mongoUrl =`${process.env.MONGO_URI}`;

// Connect to MongoDB
mongoose.connect(mongoUrl)
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
