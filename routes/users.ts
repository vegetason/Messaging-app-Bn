import passport from "passport";
import { userSignUp, userLogin, deleteAccount, deleteSentRequest, getOneUser, getAllUsers, getRequests, refusedRequest, acceptRequest, SendRequest, updateProfile, getProfile, resetPassword, verifyEmail, sendResetPasswordEmail, updatePassword, googleAuthenticate, googleRedirect, LoginByGoogle, googleAuthFailed } from "../controllers/users";
import { adminAuthenticate, authenticate, getTokenFromBrowser } from "../middlewares";
import { validateResetPassword, validatesendResetPasswordEmail, validateUpdatePassword, validateUser, validateUserLogin } from "../validations/user";
import '../services/loginByGoogle'
import { uploadSingleFile } from "../services/multer";

const express=require("express")
let  userRouter = express.Router();

userRouter.post('/signup',validateUser,userSignUp);

userRouter.get('/auth/google',googleAuthenticate);

userRouter.get('/google/callback',googleRedirect)

userRouter.get('/google/token',LoginByGoogle)

userRouter.get('/google/failure',googleAuthFailed)

userRouter.post('/login',validateUserLogin,userLogin);

userRouter.delete('/deleteAccount',authenticate,deleteAccount);

userRouter.delete('/deleteFreindRequest/:requestId',authenticate,deleteSentRequest);

userRouter.get('/getAUser/:userId',adminAuthenticate,getOneUser);

userRouter.get('/getAllUssers/',adminAuthenticate,getAllUsers);

userRouter.get('/getRequests',authenticate,getRequests);

userRouter.patch('/denyRequest/:requestId',authenticate,refusedRequest);

userRouter.patch('/acceptRequest/:requestId',authenticate,acceptRequest);

userRouter.post('/sendRequest/:receiverId',authenticate,SendRequest);

userRouter.patch('/updateProfile',authenticate,uploadSingleFile,updateProfile);

userRouter.get('/getProfile',authenticate,getProfile);

userRouter.post('/resetPassword/:email',validateResetPassword,resetPassword);//do swagger

userRouter.post('/verifyEmail',getTokenFromBrowser,verifyEmail);//do swagger

userRouter.post('/sendResetPasswordEmail',validatesendResetPasswordEmail,sendResetPasswordEmail)//do swagger

userRouter.post('/updatePassword',authenticate,validateUpdatePassword,updatePassword)//do swagger

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
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         userName:
 *           type: string
 *           example: johndoe
 *         password:
 *           type: string
 *           format: password
 *           example: securePassword123
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *     
 *     UserLogin:
 *       type: object
 *       required:
 *         - userName
 *         - password
 *       properties:
 *         userName:
 *           type: string
 *           example: johndoe
 *         password:
 *           type: string
 *           example: securePassword123
 *     
 *     ProfileUpdate:
 *       type: object
 *       properties:
 *         telephone:
 *           type: string
 *           example: "+1234567890"
 *         address:
 *           type: string
 *           example: "123 Main St, City, Country"
 *         SomethingAboutYourself:
 *           type: string
 *           example: "I am a software developer"
 *         image:
 *           type: string
 *           format: binary
 *     
 *     EmailVerification:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *     
 *     ResetPassword:
 *       type: object
 *       required:
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           format: password
 *           example: newSecurePassword123
 *         confirmPassword:
 *           type: string
 *           format: password
 *           example: newSecurePassword123
 *     
 *     UpdatePassword:
 *       type: object
 *       required:
 *         - lastPassword
 *         - updatedPassword
 *       properties:
 *         lastPassword:
 *           type: string
 *           format: password
 *           example: oldSecurePassword123
 *         updatedPassword:
 *           type: string
 *           format: password
 *           example: newSecurePassword123
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         userName:
 *           type: string
 *         phone:
 *           type: string
 *         verified:
 *           type: boolean
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         freinds:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         userName:
 *           type: string
 *         telephone:
 *           type: string
 *         image:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         SomethingAboutYourself:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Request:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [pending, accepted, failed]
 *         senderId:
 *           type: string
 *           format: uuid
 *         receiverId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *   
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Profile
 *     description: User profile management
 *   - name: Friend Requests
 *     description: Friend request management
 *   - name: User Management
 *     description: User management operations
 *
 * paths:
 *   /user/signup:
 *     post:
 *       summary: Create a new user account
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
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                   User:
 *                     $ref: '#/components/schemas/User'
 *                   message:
 *                     type: string
 *                     example: "Account created successfully Please check your email for verification"
 *                   userProfile:
 *                     $ref: '#/components/schemas/Profile'
 *                   sentMail:
 *                     type: object
 *         500:
 *           description: Error creating account
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/login:
 *     post:
 *       summary: User login
 *       tags: [Authentication]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLogin'
 *       responses:
 *         200:
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                   message:
 *                     type: string
 *                     example: "Login Successful"
 *         400:
 *           description: Login failed
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Invalid password or userName! Try again"
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/deleteAccount:
 *     delete:
 *       summary: Delete user account
 *       tags: [User Management]
 *       security:
 *         - bearerAuth: []
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
 *                     example: "Account deleted successfully"
 *                   deletedUser:
 *                     $ref: '#/components/schemas/User'
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found"
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/getProfile:
 *     get:
 *       summary: Get user profile
 *       tags: [Profile]
 *       parameters:
 *       responses:
 *         200:
 *           description: Profile retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "my Profile"
 *                   profile:
 *                     $ref: '#/components/schemas/Profile'
 *
 *   /user/updateProfile:
 *     patch:
 *       summary: Update user profile
 *       tags: [Profile]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               $ref: '#/components/schemas/ProfileUpdate'
 *       responses:
 *         200:
 *           description: Profile updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Profile updated successfully"
 *                   updatedProfile:
 *                     $ref: '#/components/schemas/Profile'
 *         400:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found!"
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/sendRequest/{receiverId}:
 *     post:
 *       summary: Send friend request
 *       tags: [Friend Requests]
 *       parameters:
 *         - name: receiverId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the receiver
 *       responses:
 *         200:
 *           description: Request sent successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Request was sent"
 *                   sentRequest:
 *                     $ref: '#/components/schemas/Request'
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/acceptRequest/{requestId}:
 *     patch:
 *       summary: Accept friend request
 *       tags: [Friend Requests]
 *       parameters:
 *         - name: requestId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the request
 *       responses:
 *         200:
 *           description: Request accepted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Request accepted"
 *                   acceptedRequest:
 *                     $ref: '#/components/schemas/Request'
 *                   sender:
 *                     $ref: '#/components/schemas/User'
 *                   receiver:
 *                     $ref: '#/components/schemas/User'
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/denyRequest/{requestId}:
 *     patch:
 *       summary: Deny friend request
 *       tags: [Friend Requests]
 *       parameters:
 *         - name: requestId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the request
 *       responses:
 *         200:
 *           description: Request denied successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Failed request"
 *                   failedRequest:
 *                     $ref: '#/components/schemas/Request'
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/deleteFreindRequest/{requestId}:
 *     delete:
 *       summary: Delete friend request
 *       tags: [Friend Requests]
 *       parameters:
 *         - name: requestId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the request
 *       responses:
 *         200:
 *           description: Request deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Request deleted successfully"
 *                   deletedRequest:
 *                     type: object
 *         400:
 *           description: You are not allowed to delete this Request
 *           content:
 *             application/json: 
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/getRequests:
 *     get:
 *       summary: Get user requests
 *       tags: [Friend Requests]
 *       responses:
 *         200:
 *           description: Requests retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Here are your requests"
 *                   sentRequests:
 *                     $ref: '#/components/schemas/Request'
 *                   receivedRequest:
 *                     $ref: '#/components/schemas/Request'
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/getAllUssers:
 *     get:
 *       summary: Get all users
 *       tags: [User Management]
 *       responses:
 *         200:
 *           description: Users retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "This is a list of all users"
 *                   users:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/User'
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/getAUser/{userId}:
 *     get:
 *       summary: Get a specific user
 *       tags: [User Management]
 *       parameters:
 *         - name: userId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the user
 *       responses:
 *         200:
 *           description: User retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User retreived"
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/verifyEmail:
 *     post:
 *       summary: Verify user email
 *       tags: [Authentication]
 *       security:
 *         - tokenInQueryParam: []
 *       responses:
 *         200:
 *           description: Email verified successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Email verification is successful"
 *         400:
 *           description: Verification failed
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found or already verified"
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/sendResetPasswordEmail:
 *     post:
 *       summary: Send email verification or password reset
 *       tags: [Authentication]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailVerification'
 *       responses:
 *         200:
 *           description: Email sent successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Reset Password Email sent successfully"
 *                   sentMail:
 *                     type: object
 *         400:
 *           description: Failed to send email
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Email is not registered"
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/resetPassword:
 *     post:
 *       summary: Reset user password
 *       tags: [Authentication]
 *       security:
 *         - tokenInQueryParam: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPassword'
 *       responses:
 *         200:
 *           description: Password reset successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Password reset Successfully!"
 *         400:
 *           description: Reset failed
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found or passwords don't match"
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *
 *   /user/updatePassword:
 *     post:
 *       summary: Update user password
 *       tags: [Authentication]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdatePassword'
 *       responses:
 *         200:
 *           description: Password updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Password updated Successfully"
 *         400:
 *           description: Update failed
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Invalid password or userName! Try again"
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */