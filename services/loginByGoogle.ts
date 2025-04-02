import { Profile } from "passport"
import User, { UserAttributes } from "../models/User"

import passport from "passport"

import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import dotenv from "dotenv"

dotenv.config()

const GOOGLE_CLIENT_ID= process.env.GoogleClientId

const GOOGLE_CLIENT_SECRET=process.env.GoogleClientSecret

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID as string,
    clientSecret: GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.googleCallbackUrl as string
  },
  async function(_accessToken:string, _refreshToken:string, profile:Profile, done:any) {
    try{
      const email=profile.emails?.[0].value

      const[user,_created]= await User.findOrCreate({
          where:{email:email},
          defaults:{
              firstName:profile.name?.givenName,
              lastName:profile.name?.familyName,
              password:'',
              verified:true,
              role:'user',//to be changed
              email:email,
              userName:'',
              phone:'',
          } as UserAttributes
      })

      return done(null,user)

  }
  catch(error){
      throw new Error("Error occured please try again")
  }
  }
));

passport.serializeUser((user, done) => {
  const authenticatedUser= user as User
  done(null, authenticatedUser.id)
})
passport.deserializeUser(async (id:string,done:any)=>{
  try{
    const user= await User.findByPk(id);
    done(null,user)
  }
  catch(error){
    done(error)
  }
});
