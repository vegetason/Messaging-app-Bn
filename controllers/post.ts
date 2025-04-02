import { Request,Response,NextFunction } from "express";
import Post, { PostAttributes } from "../models/Post";
import Comment, { CommentAttributes } from "../models/Comment";
import User, { UserAttributes } from "../models/User";
import Like from "../models/Like";
import cloudinary from "../services/cloudinary";

export async function myPosts(req:Request,res:Response) {
    try{
        const userId=(req.user as UserAttributes).id;
        const posts=await Post.findAndCountAll({where:{UserId:userId}})
        if (!posts){
            return res.status(400).json({message:"You have no posts!"})
        }
    
        return res.status(200).json({message:"Here are your posts",myPosts:posts})
    }

    catch(error){
        return res.status(400).json({error:error})
    }
    
}

export async function deleteMyPosts(req:Request,res:Response) {

    try{
        const postId=req.params.postId;
        const userId=(req.user as UserAttributes).id;
        const post=await Post.findOne({where:{UserId:userId,id:postId}})
        if(!post){
            return res.status(400).json({message:"Post not Found"})
        }
        await Post.destroy({where:{id:postId}})
        return res.status(200).json({message:"Post deleted successfully",deletedPost:post})
    }

    catch(error){
        console.error(error)
        return res.status(400).json({error:error})
    }

}

export async function createNewPost(req:Request,res:Response) {
    
    try{
        
        const { title,description}=req.body;  

        const userId=(req.user as UserAttributes).id

        const user= await User.findOne({where:{id:userId}})

        const author= user?.userName

        const files=req.files as  Express.Multer.File[];

        const images=[] as string[];
        if(files){
            await Promise.all(
                files.map(async (file:any) => {
                const result = await cloudinary.uploader.upload(file.path);
                images.push(result.secure_url)
                })
            );
        }
        
        const createdPost= await Post.create({
            title:title,
            description:description,
            image:images,
            author:author,
            UserId:userId

        } as PostAttributes)

        return res.status(200).json({message:"Post created successfully",Post:createdPost})
    }

    catch(error){
        return res.status(400).json({error:error})
    }
}

export async function createComment(req:Request,res:Response) {
    const postId=req.params.postId
    const userId=req.params.userId
    const userWhoCommented=await User.findOne({where:{id:userId}})
    const postToBeCommented=await Post.findOne({where:{id:postId}});
    const {comment}=req.body


    const createdComment=await Comment.create({
        comment:comment,
        writer:userWhoCommented?.userName,
        postId:postId
    } as CommentAttributes)
    return res.status(200).json({message:"Comment created successfully",postToBeCommented});
}

export async function getAllPostComments(req:Request,res:Response) {
    
    const postId=req.params.postId;
    const postComments=await Comment.findAll({where:{postId:postId}});

    return res.status(200).json({message:"This are all the post comments",postComments:postComments})

}

export async function deleteComment(req:Request,res:Response) {
    const commentId=req.params.commentId;
    const userId=req.params.userId
    const comment=await Comment.findOne({where:{id:commentId}});
    const user= await User.findOne({where:{id:userId}})

    if (user?.userName===comment?.writer){
        await Comment.destroy({where:{id:commentId}})
        return res.status(204).json({message:'Comment deleted successful',deleteComment:comment})
    }
}

export async function updateCOmment(req:Request,res:Response) {
    const commentId=req.params.commentId;
    const userId=req.params.userId
    const text=req.body
    const comment=await Comment.findOne({where:{id:commentId}});
    const user=await User.findOne({where:{id:userId}})

    if (user?.userName===comment?.writer){
        await comment?.update({comment:text})
        await comment?.save()
        return res.status(204).json({message:'Comment updated successful',comment})
    }
}

export async function likeAPost(req:Request,res:Response) {

    const userId=req.params.userId;
    const postId=req.params.postId
    const postToBeLiked=Post.findAll({where:{id:postId}})
    const user=await User.findOne({where:{id:userId}})
    if(!user){
        return
    }
    const likedPost=await Like.create({
        likes:"Liked a post",
        writer:user?.userName,
        postId:postId
    } as any)

    return res.status(200).json({message:"You liked a post",postToBeLiked});
}

export async function deleteLike(req:Request,res:Response) {

    const postId=req.params.postId;
    const userId=req.params.userId;

    const writer= await User.findOne({where:{id:userId}});

    const writerName=writer?.userName;

    const deletedLike=await Like.destroy({where:{
        writer:writerName,
        postId:postId
    }})

    return res.status(204).json({message:"Like deleted successfully",deletedLike:deletedLike})
}


export async function getAllPostLike(req:Request,res:Response) {
    const postId=req.params.postId;
    const postLikes= await Like.findAll({where:{postId:postId}})

    return res.status(200).json({message:"This are all the post likes",postLikes:postLikes})
}

export async function getFreindsPost(req:Request,res:Response) {

    const userId=req.params.userId;
    const user=await User.findOne({where:{id:userId}})
    const thePosts=[]
    for(let freind in user?.freinds){
        thePosts.push(await Post.findAll({where:{author:freind}}))
    }

    return res.status(200).json({message:"Here are the posts of your freinds",thePosts})
}

export async function getAllPosts(req:Request,res:Response) {
    const allPosts=await Post.findAll();
    return res.status(200).json({message:"All Posts",allPosts:allPosts})
}

//remember to look on migrations, messages and notification
