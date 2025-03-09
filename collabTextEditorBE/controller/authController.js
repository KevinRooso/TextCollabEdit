const passport = require('../auth/githubAuth');
const axios = require('axios');
const User = require("../models/user");

const authenticate = async(req,res) =>{
    passport.authenticate('github')(req, res);
}

const authcallback = async(req,res)=>{
    passport.authenticate('github', { failureRedirect: '/',session: false })(req, res, () => {            
            const { user, accessToken, refreshToken } = req.user;  
            const redirectUrl = `${process.env.REACT_URL}/dashboard?user=${encodeURIComponent(JSON.stringify({
                id: user._id,
                username: user.username,                
            }))}&accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`;
            res.redirect(redirectUrl);
        });
}

const updateUser = async(req,res) =>{
    const {userId} = req.params;
    const {publicKey, gistUrl,authenticated} = req.body;

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        //Update user with public key and gist url
        user.publicKey = publicKey;
        user.gistUrl = gistUrl;
        if(authenticated){
            user.authenticated = true;
        }

        await user.save();

        res.status(200).json({ success: true, message: "User updated successfully!" });
    }catch(error){
        res.status(500).json({ message: "Error updating user", error });
    }
}

const getUserDetails = async (req,res) => {
    const { userId } = req.params;
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({ message: "Error fetching user details", error });
    }
}

module.exports = {    
    authenticate,
    authcallback,
    updateUser,
    getUserDetails
}