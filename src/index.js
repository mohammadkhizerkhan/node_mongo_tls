require('dotenv').config();
const express = require('express');
const {User} = require('./db');

const app = express();
const port = 3000;

app.use(express.json());

// Endpoint to create a user
app.post('/user', async (req, res) => {
  const { name, age, email } = req.body;
  const newUser = new User({ name, age, email });

  try {
    const savedUser = await newUser.save();
    res.status(201).send({ message: 'User created', user: savedUser });
  } catch (err) {
    res.status(500).send({ message: 'Error creating user', error: err });
  }
});

// Endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching users', error: err });
  }
});

app.get("/",(req, res) => {
  res.send("hellow world")
})

// Start the server
app.listen(port, () => {
  console.log(process.env.MONGO_URI)
  console.log(`Server running at http://localhost:${port}`);
});