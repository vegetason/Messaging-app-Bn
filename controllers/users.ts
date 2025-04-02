import User, { UserAttributes, userCreationAttribute } from "../models/User";
import { NextFunction, Request,Response } from "express";
import Profile from "../models/Profile";
import cloudinary from "../services/cloudinary";
import Requests from "../models/Requests";
import { comparePassword, generateJwtToken,getUserByEmail,hashPassword, sendEmail} from "../services/users";
import { resetPasswordEmailInfo, verifyEmailInfo } from "../information/userInfo";
import { getUser } from "../middlewares";
import passport from "passport";


export async function userSignUp(req:Request,res:Response){
    try{
        const{
            firstName,
            lastName,
            email,
            userName,
            phone
        }=req?.body

       const password= await hashPassword(req.body.password);

       const createdUser=await User?.create({
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:password,
        userName:userName,
        phone:phone,
        verified:false,
        role: "user" //remember to change this
       }as UserAttributes)

       const token= await generateJwtToken(createdUser,createdUser.id)
       const userProfile=await Profile.create({
        userId:createdUser.id,
        firstName:firstName,
        lastName: lastName,
        userName: userName,
        telephone:'',
        profileImage:'',
        address:'',
        email: email,
        SomethingAboutYourself:''
       } as any)
       verifyEmailInfo.link=process.env.VERIFY_EMAIL_LINK+`?token=${token}`
       const sentMail=await sendEmail(verifyEmailInfo.body,verifyEmailInfo.link,verifyEmailInfo.buttonInfo,createdUser.userName,createdUser.email,verifyEmailInfo.subject)
       return res.status(200).json({token:token,User:createdUser,message:"Account created successfully Please check your email for verification",userProfile:userProfile,sentMail:sentMail})
    }
    catch(error){
        console.log(error)
        return res.status(500).json ({error:error})
    }
}
export async function userLogin(req:Request,res:Response){
    try{
        const {userName,password}=req.body;

        const user= await User.findOne({where:{userName:userName}})

        if(!user){
            return res.status(400).json({message:"UserName not found! Sign up"})
        }

        if(user.verified!==true){
            return res.status(400).json({message:"User is not verified!"})
        }
        const isPasswordCorrect:boolean|null= await comparePassword(password,user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid password or userName! Try again "})
        }
    
        const token=await generateJwtToken(user,user.id)
        return res.status(200).json({token:token,message:"Login Successful"})
    }
    catch(error){
        return res.status(500).json ({error:error})
    }
}

export async function deleteAccount(req:Request,res:Response) {
    try{
        const userId=(req.user as UserAttributes).id

        const user= await User.findByPk(userId)
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
    
        const deletedUser= await User.destroy({where:{id:userId}})
    
        return res.status(200).json({message:"Account deleted successfully",deletedUser:req.user})
    }
    catch(error){
       return res.status(500).json ({error:error})
    }
}

export async function getProfile(req:Request,res:Response) {
    const userId=req.params.userId
    const myProfile=Profile.findAll({where:{userId:userId}})
    
    return res.status(200).json({message:"my Profile",profile:myProfile})
}

export async function updateProfile(req:Request,res:Response) {

    const{telephone,address,SomethingAboutYourself}=req.body
    console.log(req.files)
    const userId=(req.user as UserAttributes).id
    const myProfile=await Profile.findOne({where:{userId:userId}})
    const files = req.files as Express.Multer.File[];
    let profileImage=''
    const profile= await Profile.findOne({where:{userId:userId}})
    
    if(!profile){
        return res.status(400).json({message:"User not found!"})
    }

    if(files){
        await Promise.all(
            files.map(async (file:any) => {
              const result = await cloudinary.uploader.upload(file.path);
              profileImage=result.secure_url
              console.log(profileImage)
            })
          );
    }


profile.telephone=telephone
profile.SomethingAboutYourself=SomethingAboutYourself
profile.profileImage=profileImage
profile.address=address
await profile.save()

    return res.status(200).json({message:"Profile updated successfully",updatedProfile:profile})
}

export async function SendRequest(req:Request,res:Response) {
    const requestSender=req.params.senderId;
    const requestReceiver=req.params.receiverId;

    const sentRequest=await Requests.create({
        status: 'pending',
        senderId: requestSender,
        receiverId: requestReceiver
    } as any)

    return res.status(200).json({message:'Request was sent',sentRequest:sentRequest})
}

export async function acceptRequest(req:Request,res:Response) {
    const requestSender=req.params.senderId;
    const requestReceiver=req.params.receiverId;
    const requestId=req.params.requestId;

    const request=await Requests.findOne({where:{id:requestId}});

    const acceptedRequest=await request?.update({status:'accepted'});

    const sender=await User.findOne({where:{id:requestSender}});
    const receiver=await User.findOne({where:{id:requestReceiver}});
    const freindOfSender=sender?.freinds as any;
    const freindOfReceiver=receiver?.freinds as any; 


    await sender?.update({freinds:freindOfSender.push(receiver)});
    await receiver?.update({freinds:freindOfReceiver.push(sender)})

    await sender?.save();
    await receiver?.save(); 

    return res.status(200).json({message:"Request accepted",acceptedRequest:acceptedRequest,sender:sender,receiver:receiver})
}

export async function refusedRequest(req:Request,res:Response) {
    const requestId=req.params.requestId;
    const request=await Requests.findOne({where:{id:requestId}});

    const failedRequest=await request?.update({status:'failed'});

    return res.status(200).json({message:"Failed request",failedRequest:failedRequest})

}

export async function getRequests(req:Request,res:Response) {
    const userId=req.params.userId
    const sentRequests=await Requests.findOne({where:{senderId:userId}})
    const receivedRequest=await Requests.findOne({where:{receiverId:userId}});

    return res.status(200).json({message:"Here are your requests",sentRequests:sentRequests,receivedRequest:receivedRequest})
}

export async function getAllUsers(req:Request,res:Response){
    const users=await User.findAll();
    return res.status(200).json({message:"This is a list of all users",users:users})
}
export async function getOneUser(req:Request,res:Response) {
    const userId=req.params.userId;
    const user=await User.findOne({where:{id:userId}});
    return res.status(200).json({message:"User retreived",user:user})
}
export async function deleteSentRequest(req:Request,res:Response) {
    const userId=req.params.userId;
    const  receiverId=req.params. receiverId
    const deletedRequest=await Requests.destroy({where:{
        senderId:userId,
        receiverId: receiverId,
    }});

    return res.status(204).json({message:"Request deleted successfully",deletedRequest:deletedRequest})
}


export async function LoginByGoogle(req:Request,res:Response){
    try{
        const user=req.user as UserAttributes;
        const token=await generateJwtToken(user,user.id)
        const redirectLink=process.env.GOOGLE_REDIRECT_LINK
        // res.redirect(`${redirectLink}${token}`);      REPLACE IT WITH FRONTEND URL
        res.status(200).json({message:"Google Authentication Successfull!",token:token})
    }
    catch(error){
        res.status(500).json ({error:error})
    }
}

export function googleRedirect (req:Request,res:Response,next:NextFunction) {
    passport.authenticate("google", {
      successRedirect: "/api/user/google/token",
      failureRedirect: "/api/user/google/failure",
    })(req, res, next);
  };

export async function googleAuthenticate(req:Request,res:Response,next:NextFunction) {
    passport.authenticate("google",{scope:["email","profile"]})(req, res, next);
}

export function googleAuthFailed (_req: Request, res: Response) {
    res.status(400).json({ message: "Authentication failed" });
  };

export async function enhanceGoogleUserData(req:Request,res:Response) {
    
}
export async function verifyEmail(req:Request,res:Response,next:NextFunction) {
    try{
        const userId=(req.user as UserAttributes).id;
        const user=await User.findByPk(userId);
    
        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }
    
        if(user.verified===true){
            return res.status(400).json({message:"User is already verified!"})
        }
    
        user.verified=true;
        await user.save();
    
        return res.status(200).json({
            message:"Email verification is successful"
        })
    }
    catch(error){
        return res.status(500).json ({error:error})
    }
}

export async function sendResetPasswordEmail(req:Request,res:Response) {
    try{
        const email=req.body.email;
        const user= await getUserByEmail(email);
        if(!user){
            return res.status(400).json({message:"Email is not registered"})
        }
        const userName=user.userName
        const sentMail=await sendEmail(resetPasswordEmailInfo.body,resetPasswordEmailInfo.link,resetPasswordEmailInfo.buttonInfo,userName,email,resetPasswordEmailInfo.subject)
    
        return res.status(200).json({message:"Reset Password Email sent successfully",sentMail:sentMail})
    } 
    catch(error){
        return res.status(500).json ({error:error})
    }   
}

export async function resetPassword(req:Request,res:Response) {
    try{
        const email=req.params.email
        const user=await User.findOne({where:{email:email}})
    
        if(!user){
            return res.status(400).json({message:"User not found!"})
        }

        const newPassword=req.body.newPassword;
        const confirmPassword=req.body.confirmPassword;
        
        if(newPassword!==confirmPassword){
            return res.status(400).json({message:"Please confirm your password Well!"})
        }
    
        user.password=await hashPassword(newPassword)
        await user.save();
    
        return res.status(200).json({message:"Password reset Successfully!"})
    }
    catch(error){
        return res.status(500).json ({error:error})
    } 
}
export async function updatePassword(req:Request,res:Response){
    try{
        const user=req.user as User
        const lastPassword=req.body.lastPassword;
    
        const isPasswordCorrect:boolean|null= await comparePassword(lastPassword,user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid password or userName! Try again "})
        }
    
        const newPassword=req.body.updatedPassword
    
        user.password= await hashPassword(newPassword)
        await user.save()
        return res.status(200).json({message:"Password updated Successfully"})
    }
    catch(error){
        return res.status(500).json ({error:error})
    } 
}//see if it works
//send Verification email
//loginby google
//userlogout
//Test verify email
//test reset password
//test sending email
//test login by google