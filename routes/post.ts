import express from "express"


const { createNewPost, myPosts, deleteMyPosts,deleteComment,deleteLike,getAllPostComments,getAllPostLike,getFreindsPost,getAllPosts,likeAPost,updateCOmment,createComment } = require('../controllers/post');

const postRouter=express.Router()


postRouter.get('/myPosts',myPosts);

postRouter.delete('/deletePost/postId',deleteMyPosts);

postRouter.post('/createPost',createNewPost);

postRouter.delete('/deleteComment/:commentId/:userId',deleteComment);

postRouter.delete('/deleteLike/:postId/:userId',deleteLike);

postRouter.post('/createComment/:postId/:userId',createComment);

postRouter.get('/postComments/:postId',getAllPostComments);

postRouter.get('/postLikes/:postId',getAllPostLike);

postRouter.get('/freindPosts/:userId',getFreindsPost);

postRouter.get('/allPosts',getAllPosts);

postRouter.post('/likePost/:userId/:postId',likeAPost);

postRouter.patch('/updateComment/:userId/:commentId',updateCOmment);



export default postRouter;