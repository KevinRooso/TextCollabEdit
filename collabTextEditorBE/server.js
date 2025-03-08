const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('./auth/githubAuth');
const User = require('./models/user');

const app = express();

// DB Connection
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('Connected to MongoDB'))
.catch(err => console.log("MongoDB Connection Error",err));

// Set up OAuth
app.use(passport.initialize());

// GitHub OAuth Login Route
app.get('/auth/github', (req, res) => {
    passport.authenticate('github')(req, res);
});

// OAuth Callback Route
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/',session: false }),
    (req, res) => {
        const { user, accessToken, refreshToken } = req.user;       
        const redirectUrl = `${process.env.REACT_URL}/dashboard?user=${encodeURIComponent(JSON.stringify({
            id: user._id,
            username: user.username,
            email: user.email,
            newUser: user.newUser
        }))}&accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`;
        res.redirect(redirectUrl);
    }
)

// Server Test Running
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});