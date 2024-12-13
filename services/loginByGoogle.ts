import { Profile } from "passport"
import { UserAttributes } from "../models/User"

const passport=require('passport')

const GoogleStrategy=require('passport-google-oauth2').Strategy

const dotenv=require ('dotenv')

dotenv.config()

const GOOGLE_CLIENT_ID= process.env.GoogleClientId

const GOOGLE_CLIENT_SECRET=process.env.GoogleClientSecret

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.googleCallbackUrl
  },
  function(_accessToken:string, _refreshToken:string, profile:Profile, done:any) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return done(null,profile);
  }
));

passport.serializeUser((user:UserAttributes,done:any)=>{
    done(null,user)
});
passport.deserializeUser((user:UserAttributes,done:any)=>{
    done(null,user)
});
