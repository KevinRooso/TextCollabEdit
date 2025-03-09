const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('./auth/githubAuth');
const cors = require('cors');
const User = require('./models/user');
const authController = require('./controller/authController');

const app = express();
// Middleware to parse json
app.use(express.json());
// Middleware to enable cors
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('Connected to MongoDB'))
.catch(err => console.log("MongoDB Connection Error",err));

// Set up OAuth
app.use(passport.initialize());

// GitHub OAuth Login Route
app.get('/auth/github',authController.authenticate);

// OAuth Callback Route
app.get('/auth/github/callback',authController.authcallback)

// Update User Route
app.put('/api/user/:userId', authController.updateUser);

// Get User Details
app.get('/api/user/:userId', authController.getUserDetails);

// Server Test Running
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});