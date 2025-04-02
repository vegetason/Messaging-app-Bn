import { createComment, createNewPost, deleteComment, deleteLike, deleteMyPosts, getAllPostComments, getAllPostLike, getAllPosts, getFreindsPost, likeAPost, myPosts, updateCOmment } from "../controllers/post";
import { adminAuthenticate, authenticate } from "../middlewares";
import { uploadManyFiles } from "../services/multer";
import { validatePost } from "../validations/post";


const express=require("express")


let postRouter=express.Router()


postRouter.get('/myPosts',authenticate,myPosts);
 
postRouter.delete('/deletePost/:postId',authenticate,deleteMyPosts);

postRouter.post('/create',authenticate,uploadManyFiles,validatePost,createNewPost);

postRouter.delete('/deleteComment/:commentId/:userId',deleteComment);

postRouter.delete('/deleteLike/:postId/:userId',deleteLike);

postRouter.post('/createComment/:postId/:userId',createComment);

postRouter.get('/postComments/:postId',getAllPostComments);

postRouter.get('/postLikes/:postId',getAllPostLike);

postRouter.get('/freindPosts/:userId',getFreindsPost);

postRouter.get('/allPosts',adminAuthenticate,getAllPosts);

postRouter.post('/likePost/:userId/:postId',likeAPost);

postRouter.patch('/updateComment/:userId/:commentId',updateCOmment);



export default postRouter;


/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: array
 *           items:
 *             type: string
 *         author:
 *           type: string
 *         UserId:
 *           type: number
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         comment:
 *           type: string
 *         writer:
 *           type: string
 *         postId:
 *           type: number
 *     Like:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         likes:
 *           type: string
 *         writer:
 *           type: string
 *         postId:
 *           type: number
 *     PostResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         Post:
 *           $ref: '#/components/schemas/Post'
 *     CommentResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         postToBeCommented:
 *           $ref: '#/components/schemas/Post'
 *     PostCommentsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         postComments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *     PostLikesResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         postLikes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Like'
 *     AllPostsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         allPosts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Post'
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * tags:
 *   - name: Post
 *     description: API endpoints related to posts
 * 
 * paths:
 *   # POST CRUD OPERATIONS
 *   /post/create:
 *     post:
 *       summary: Create a new post
 *       tags: [Post]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *               required:
 *                 - title
 *                 - description
 *       responses:
 *         200:
 *           description: Post created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PostResponse'
 *         400:
 *           description: Invalid input
 *         401:
 *           description: Unauthorized access
 *
 *   /post/myPosts:
 *     get:
 *       summary: Get user's posts
 *       tags: [Post]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Posts retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         400:
 *           description: No posts found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: You have no posts!
 *         401:
 *           description: Unauthorized access
 *
 *   /post/allPosts:
 *     get:
 *       summary: Get all posts
 *       tags: [Post]
 *       responses:
 *         200:
 *           description: All posts retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AllPostsResponse'
 *
 *   /post/freindPosts/{userId}:
 *     get:
 *       summary: Get posts from user's friends
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID to get friends' posts
 *       responses:
 *         200:
 *           description: Friends' posts retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   thePosts:
 *                     type: array
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *         404:
 *           description: User not found
 * 
 *   /post/deletePost/{postId}:
 *     delete:
 *       summary: Delete a post
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: postId
 *           schema:
 *             type: string
 *           required: true
 *           description: Post ID to delete
 *       responses:
 *         200:
 *           description: Post deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Post deleted successfully
 *                   deletedPost:
 *                     type: object
 *         404:
 *           description: Post not found
 *
 *   # COMMENT CRUD OPERATIONS
 *   /post/createComment/{postId}/{userId}:
 *     post:
 *       summary: Create a comment on a post
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: postId
 *           schema:
 *             type: string
 *           required: true
 *           description: Post ID to comment on
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID of the commenter
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   type: string
 *               required:
 *                 - comment
 *       responses:
 *         200:
 *           description: Comment created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CommentResponse'
 *         400:
 *           description: Invalid input
 *         404:
 *           description: Post not found
 *
 *   /post/postComments/{postId}:
 *     get:
 *       summary: Get all comments for a post
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: postId
 *           schema:
 *             type: string
 *           required: true
 *           description: Post ID to get comments for
 *       responses:
 *         200:
 *           description: Comments retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PostCommentsResponse'
 *         404:
 *           description: Post not found
 *
 *   /post/updateComment/{userId}/{commentId}:
 *     patch:
 *       summary: Update a comment
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID of the commenter
 *         - in: path
 *           name: commentId
 *           schema:
 *             type: string
 *           required: true
 *           description: Comment ID to update
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   type: string
 *               required:
 *                 - comment
 *       responses:
 *         204:
 *           description: Comment updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Comment updated successful
 *                   comment:
 *                     $ref: '#/components/schemas/Comment'
 *         400:
 *           description: Invalid input
 *         404:
 *           description: Comment not found
 *
 *   /post/deleteComment/{commentId}/{userId}:
 *     delete:
 *       summary: Delete a comment
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: commentId
 *           schema:
 *             type: string
 *           required: true
 *           description: Comment ID to delete
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID of the commenter
 *       responses:
 *         204:
 *           description: Comment deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Comment deleted successful
 *                   deleteComment:
 *                     $ref: '#/components/schemas/Comment'
 *         404:
 *           description: Comment not found
 *
 *   # LIKE OPERATIONS
 *   /post/likePost/{userId}/{postId}:
 *     post:
 *       summary: Like a post
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID who is liking the post
 *         - in: path
 *           name: postId
 *           schema:
 *             type: string
 *           required: true
 *           description: Post ID to like
 *       responses:
 *         200:
 *           description: Post liked successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   postToBeLiked:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Post'
 *         404:
 *           description: Post not found
 *
 *   /post/postLikes/{postId}:
 *     get:
 *       summary: Get all likes for a post
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: postId
 *           schema:
 *             type: string
 *           required: true
 *           description: Post ID to get likes for
 *       responses:
 *         200:
 *           description: Likes retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PostLikesResponse'
 *         404:
 *           description: Post not found
 *
 *   /post/deleteLike/{postId}/{userId}:
 *     delete:
 *       summary: Delete a like from a post
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: postId
 *           schema:
 *             type: string
 *           required: true
 *           description: Post ID
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID who liked the post
 *       responses:
 *         204:
 *           description: Like deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Like deleted successfully
 *                   deletedLike:
 *                     type: object
 *         404:
 *           description: Like not found
 */