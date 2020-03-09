const passport = require('passport');

const FacebookToken = require('passport-facebook-token');

const { User} = require("../Models/User");
const userController = require("../Controllers/User");

passport.use(
    'AuthenticateWithFacebook', 
    new FacebookToken({
        clientID: process.env.FACEBOOK_CLIENT_ID, 
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }, async (accessToken, refreshToken, profile, done) =>{
        try{
            //console.log(profile);

            //Check email
            const existedUser = await User.findOne({ 
                $or: [{facebookId : profile.id}, {email: profile.emails[0].value }]
            });
            console.log("existedUser" ,existedUser);

            if (existedUser){ return done(null, existedUser) }

             //Create new user
            const newUser = await new User({
                name: profile._json.name,
                email: profile._json.email,
                role: ["user"],
                avatar: profile.photos[0].value,
                facebookId: profile.id
            }).save();

            done(null, newUser); //Su dung để next qua middleware tiếp theo
            //=>res.user = newUser;
            //=>next()

        }catch(e){
            done(e, false, e.message)
        }
    })
);

module.exports = passport;