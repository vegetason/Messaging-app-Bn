import passport from "passport";
import { userSignUp, userLogin, deleteAccount, deleteSentRequest, getOneUser, getAllUsers, getRequests, refusedRequest, acceptRequest, SendRequest, updateProfile, getProfile } from "../controllers/users";
require('../services/loginByGoogle')



var express = require('express');
let  userRouter = express.Router();

userRouter.post('/signup',userSignUp);

userRouter.post('/login',userLogin);

userRouter.delete('/deleteAccount/:userId',deleteAccount);

userRouter.delete('/deleteFreindRequest/:senderId/: receiverId',deleteSentRequest);

userRouter.get('/getAUser/:userId',getOneUser);

userRouter.get('/getAllUssers/',getAllUsers);

userRouter.get('/getRequests/:userId',getRequests);

userRouter.patch('/denyRequest/:requestId',refusedRequest);

userRouter.patch('/acceptRequest/:senderId/:receiverId/:requestId',acceptRequest);

userRouter.post('/sendRequest/:senderId/:receiverId',SendRequest);

userRouter.patch('/updateProfile/:userId',updateProfile);

userRouter.get('/getProfile/:userId',getProfile);

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
 * /users:
 *   get:
 *     summary: Sign Up
 *     description: Create an Account.
 *     responses:
 *       200:
 *         description: Account created Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

