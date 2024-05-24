const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');
const dotenv = require('dotenv');
require('dotenv').config();




passport.serializeUser((user, done) => {
    done(null, user.id);
}
);

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {//
        done(null, user);
    });
}
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'user',
                    isVerified: true
                });
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }


    }
)
);


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/v1/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email'],
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ facebookId: profile.id });
            if (!user) {
                user = await User.create({
                    facebookId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'user',
                    isVerified: true
                });
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
)
);

module.exports = passport;





