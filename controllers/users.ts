import User, { UserAttributes, userCreationAttribute } from "../models/User";
import { NextFunction, Request,Response } from "express";
import Profile from "../models/Profile";
import cloudinary from "../services/cloudinary";
import Requests from "../models/Requests";
import { comparePassword, generateJwtToken,getUserByEmail,hashPassword, sendEmail} from "../services/users";
import { verifyEmailInfo } from "../information/userInfo";


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
       const sentMail=await sendEmail(verifyEmailInfo.body,verifyEmailInfo.link,verifyEmailInfo.buttonInfo,createdUser.userName,createdUser.email,verifyEmailInfo.subject)
        return res.status(200).json({token:token,User:createdUser,message:"Account created successfully Please check your email for verification",sentMail:sentMail,userProfile:userProfile})

    }
    catch(error){
        console.log(error)
        return res.status(500).json ({error:error})
    }
}
export async function userLogin(req:Request,res:Response){
    const {userName,password}=req.body;

    const user:any= await User.findOne({where:{userName:userName}})
    const isPasswordCorrect:boolean|null= await comparePassword(password,user.password)

    const token=await generateJwtToken(user,user.id)
    if(!user){
        return res.status(400).json({message:"UserName not found! Sign up"})
    }

    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid password or userName! Try again "})
    }

    return res.status(200).json({token:token,message:"Login Successful"})

}

export async function deleteAccount(req:Request,res:Response) {
    const userId=(req.user as UserAttributes).id

    const user= await User.findByPk(userId)
    if(!user){
        return res.status(404).json({ message: "User not found" });
    }

    const deletedUser= await User.destroy({where:{id:userId}})

    return res.status(200).json({message:"Account deleted successfully",deletedUser:req.user})
}

export async function getProfile(req:Request,res:Response) {
    const userId=req.params.userId
    const myProfile=Profile.findAll({where:{userId:userId}})
    
    return res.status(200).json({message:"my Profile",profile:myProfile})
}

export async function updateProfile(req:Request,res:Response) {

    const{telephone,address,SomethingAboutYourself}=req.body
    const userId=req.params.userId
    const myProfile=await Profile.findOne({where:{userId:userId}})
    const files=req.params.files as any;
    let profileImage=''

    if(files){
        await Promise.all(
            files.map(async (file:any) => {
              const result = await cloudinary.uploader.upload(file.path);
              profileImage=result.secure_url
            })
          );
    }

   const updatedProfile= await myProfile?.update({
        telephone:telephone,
        address:address,
        SomethingAboutYourself:SomethingAboutYourself,
        profileImage:profileImage
    })

    return res.status(200).json({message:"Profile updated successfully",updatedProfile:updatedProfile})
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



export async function LoginByGoogle(req:Request,res:Response){}

export async function verifyEmail(req:Request,res:Response,next:NextFunction) {
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

export async function sendResetPasswordEmail(req:Request,res:Response) {
    const email=req.body.email;
    const user= await getUserByEmail(email);
    if(!user){
        return res.status(400).json({message:"Email is not registered"})
    }
    const userName=user.userName
    const sentMail=await sendEmail(verifyEmailInfo.body,verifyEmailInfo.link,verifyEmailInfo.buttonInfo,userName,email,verifyEmailInfo.subject)

    return res.status(200).json({message:"Reset Password Email sent successfully",sentMail:sentMail})
    
}

export async function resetPassword(req:Request,res:Response) {
    const userId=(req.user as UserAttributes).id;
    const user=await User.findByPk(userId)
    const newPassword=req.body.newPassword;
    const confirmPassword=req.body.confirmPassword;

    if(!user){
        return res.status(400).json({message:"User not found!"})
    }

    if(newPassword!==confirmPassword){
        return res.status(400).json({message:"Please confirm your password Well!"})
    }

    user.password=await hashPassword(newPassword)
    await user.save();

    return res.status(200).json({message:"Password reset Successfully!"})
}