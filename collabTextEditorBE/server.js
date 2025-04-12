const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('./auth/githubAuth');
const cors = require('cors');
const User = require('./models/user');
const authController = require('./controller/authController');
const documentController = require('./controller/documentController');
const authenticateJWT = require('./middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const app = express();
// Middleware to parse json
app.use(express.json());
// Middleware to enable cors
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('Connected to MongoDB'))
.catch(err => console.log("MongoDB Connection Error",err));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    headers: true,
  });

// Limiter
app.use(limiter)

// Set up OAuth
app.use(passport.initialize());

// GitHub OAuth Login Route
app.get('/auth/github',authController.authenticate);

// OAuth Callback Route
app.get('/auth/github/callback',authController.authcallback)

app.use('/api', authenticateJWT);

// User Api Routes
app.get('/api/users',authController.getUsers); // Get All users
app.put('/api/user/:userId', authController.updateUser); // Update a user
app.get('/api/user/:userId', authController.getUserDetails); // Get User Details By Id

// Document Api Routes
app.post('/api/documents', documentController.createDocument); // Create a new document
app.get('/api/documents/:userId', documentController.getDocumentList); // Get document list for a user
app.get('/api/document/:documentId', documentController.getDocument); // Get details of a specific document
app.put('/api/document/:documentId/content', documentController.updateDocumentContent); // Update content only
app.put('/api/document/:documentId', documentController.updateDocumentContentAndCollaborators); // Update content and collaborators

// Server Test Running
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});