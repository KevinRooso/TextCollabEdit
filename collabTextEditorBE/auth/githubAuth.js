const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

// Github Oauth Credentials
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

// Passport Configure to use Github Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: process.env.GITHUB_CALLBACK,
      scope: ["gist"], 
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = new User({
            githubId: profile.id,
            username: profile.username            
          });
          await user.save();                    
        }
        return done(null, { user, accessToken, refreshToken});        
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user to store user in session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

module.exports = passport;