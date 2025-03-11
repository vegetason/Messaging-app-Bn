import passport from "passport";
import { userSignUp, userLogin, deleteAccount, deleteSentRequest, getOneUser, getAllUsers, getRequests, refusedRequest, acceptRequest, SendRequest, updateProfile, getProfile, resetPassword, verifyEmail, sendResetPasswordEmail } from "../controllers/users";
require('../services/loginByGoogle')
import { authenticate, getTokenFromBrowser } from "../middlewares";
import { validateResetPassword, validatesendEmailVerification, validateUser, validateUserLogin } from "../validations/user";



var express = require('express');
let  userRouter = express.Router();

userRouter.post('/signup',validateUser,userSignUp);

userRouter.post('/login',validateUserLogin,userLogin);

userRouter.delete('/deleteAccount',authenticate,deleteAccount);

userRouter.delete('/deleteFreindRequest/:senderId/:receiverId',deleteSentRequest);

userRouter.get('/getAUser/:userId',getOneUser);

userRouter.get('/getAllUssers/',getAllUsers);

userRouter.get('/getRequests/:userId',getRequests);

userRouter.patch('/denyRequest/:requestId',refusedRequest);

userRouter.patch('/acceptRequest/:senderId/:receiverId/:requestId',acceptRequest);

userRouter.post('/sendRequest/:senderId/:receiverId',SendRequest);

userRouter.patch('/updateProfile/:userId',updateProfile);

userRouter.get('/getProfile/:userId',getProfile);

userRouter.post('/resetPassword',getTokenFromBrowser,validateResetPassword,resetPassword);//do swagger

userRouter.post('/verifyEmail',getTokenFromBrowser,verifyEmail);//do swagger

userRouter.post('/sendEmailVerification',validatesendEmailVerification,sendResetPasswordEmail)//do swagger

userRouter.get('/auth/google',
  passport.authenticate('google',{scope:['email','profile']})
)

userRouter.get('/google/callback',
passport.authenticate('google',{
  successRedirect:'users/protected',
  failureRedirect:'users/auth/failure'
})
);

// userRouter.get('/protected',(req,res)=>{
//   res.send('<a href="/auth/google">Login By Google</a>')
// })

// userRouter.get('/auth/failure', function(req, res, next) {
//   res.send('respond with a resource');
// });

export default userRouter

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignUp:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - userName
 *         - password
 *         - phone
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         userName:
 *           type: string
 *           description: User's unique username
 *         password:
 *           type: string
 *           description: User's password
 *         phone:
 *           type: string
 *           description: User's phone 
 *           example: "+250788888888"
 *     UserSignUpResponse:
 *       type: object
 *       properties:
 *         User:
 *           type: object
 *           description: Created user details
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         message:
 *           type: string
 *         userProfile:
 *           type: object
 *           description: User's profile details
 * 
 *     UserLogin:
 *       type: object
 *       required:
 *         - userName
 *         - password
 *       properties:
 *         userName:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           description: User's password
 * 
 *     UserLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         message:
 *           type: string
 * 
 * paths:
 *   /user/signup:
 *     post:
 *       summary: User Sign Up
 *       tags: [Authentication]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSignUp'
 *       responses:
 *         200:
 *           description: Account created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserSignUpResponse'
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 *   /user/login:
 *     post:
 *       summary: User Login
 *       tags: [Authentication]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLogin'
 *       responses:
 *         200:
 *           description: Login Successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserLoginResponse'
 *         400:
 *           description: Invalid credentials
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 * 
 *   /user/deleteAccount:
 *     delete:
 *       summary: Delete User Account
 *       tags: [Authentication]
 *       responses:
 *         200:
 *           description: Account deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   deletedUser:
 *                     type: object
 */