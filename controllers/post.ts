import { Request,Response,NextFunction } from "express";
import Post, { PostAttributes } from "../models/Post";
import Comment, { CommentAttributes } from "../models/Comment";
import User from "../models/User";
const Like=require('../models/like');
const cloudinary = require('../services/cloudinary');
require('../services/cloudinary');
async function myPosts(req:Request,res:Response) {

    const {author}=req.params;
    const posts=Post.findAll({where:{author:author}})
    if (!posts){
        return res.status(400).json({message:"You have no posts!"})
    }

    return res.status(200).json({message:"Here are your posts"})
    
}

async function deleteMyPosts(req:Request,res:Response) {

    const postId=req.params.postId;
   const  deletedPost=await Post.destroy({where:{id:postId}})
    return res.status(204).json({message:"Post deleted successfully",deletedPost:deletedPost})

}

async function createNewPost(req:Request,res:Response) {
    
    const { title,description}=req.body;    

    const userId=req.params.userId;

    const user= await User.findOne({where:{id:userId}})

    const author= user?.userName

    if (!title || !description||!author){
        return res.status(400).json({message:"Please complete all the reequired information"})
    }

    const files=req.files as  Express.Multer.File[];

    if(!files){
        return res.status(400).json({message:"Please upload an image to continue"})
    }

    const images=[] as string[];
    await Promise.all(
        files.map(async (file:any) => {
          const result = await cloudinary.uploader.upload(file.path);
          images.push(result.secure_url);
        })
      );

    const createdPost= await Post.create({
        title:title,
        description:description,
        image:images,
        author:author,
        UserId:userId

    } as PostAttributes)

    return res.status(200).json({message:"Post created successfully",Post:createdPost})
}

async function createComment(req:Request,res:Response) {
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

async function getAllPostComments(req:Request,res:Response) {
    
    const postId=req.params.postId;
    const postComments=await Comment.findAll({where:{postId:postId}});

    return res.status(200).json({message:"This are all the post comments",postComments:postComments})

}

async function deleteComment(req:Request,res:Response) {
    const commentId=req.params.commentId;
    const userId=req.params.userId
    const comment=await Comment.findOne({where:{id:commentId}});
    const user= await User.findOne({where:{id:userId}})

    if (user?.userName===comment?.writer){
        await Comment.destroy({where:{id:commentId}})
        return res.status(204).json({message:'Comment deleted successful',deleteComment:comment})
    }
}

async function updateCOmment(req:Request,res:Response) {
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

async function likeAPost(req:Request,res:Response) {

    const userId=req.params.userId;
    const postId=req.params.postId
    const postToBeLiked=Post.findAll({where:{id:postId}})
    const user=await User.findOne({where:{id:userId}})
    const likedPost=await Like.create({
        likes:"Liked a post",
        writer:user?.userName,
        postId:postId
    })

    return res.status(200).json({message:"You liked a post",postToBeLiked});
}

async function deleteLike(req:Request,res:Response) {

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


async function getAllPostLike(req:Request,res:Response) {
    const postId=req.params.postId;
    const postLikes= await Like.findAll({where:{postId:postId}})

    return res.status(200).json({message:"This are all the post likes",postLikes:postLikes})
}

async function getFreindsPost(req:Request,res:Response) {

    const userId=req.params.userId;
    const user=await User.findOne({where:{id:userId}})
    const thePosts=[]
    for(let freind in user?.freinds){
        thePosts.push(await Post.findAll({where:{author:freind}}))
    }

    return res.status(200).json({message:"Here are the posts of your freinds",thePosts})
}

async function getAllPosts(req:Request,res:Response) {
    const allPosts=await Post.findAll();
    return res.status(200).json({message:"All Posts",allPosts:allPosts})
}

//remember to look on migrations, messages and notification

module.exports={
    myPosts,
    deleteMyPosts,
    createNewPost,
    getAllPosts,
    getFreindsPost,
    getAllPostLike,
    deleteLike,
    likeAPost,
    updateCOmment,
    deleteComment,
    getAllPostComments,
    createComment 
}