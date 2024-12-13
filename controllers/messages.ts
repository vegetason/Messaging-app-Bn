// const User =require("../models/user")
// const Messages=require("../models/messages")
// async function createMessage(req,res) {
//     const senderId=req.params.senderId;
//     const receiverId=req.params.receiverId;
//     const {text}= req.body;
//     const files=req.files;

//     //uploading file

//     const theMessage=await Messages.create({
//         senderId:senderId,
//         receiverId:receiverId,
//         text:text
//     })

//     return res.json({message:"The message was sent",})
// }


// async function deleteMessageSender(req,res) {
//     const userId=req.params.userId;
//     const messageId=req.params.messageId;

//     const deletedMessage=await Messages.destroy({where:{senderId:userId,id:messageId}})

//     return res.status(400).json({message:"Message deleted",deletedMessage:deletedMessage})
// }

// async function receiveMessage(req,res) {
//     const userId=req.params.userId;
//     const messages=await Messages.findAll({where:{receiverId:userId}})

//     return res.status(200).json({message:"My messages",messages:messages})
// }

// async function deleteMessageReceiver(req,res) {
//     const userId=req.params.userId;
//     const messageId=req.params.messageId;

//     let theMessageToDelete=await Messages.findOne({receiverId:userId,id:messageId});

//     // await theMessageToDelete.hide='ON';
// //update it 
// }

// //notification  routers and solve database problems and hush passwords

// module.exports={
//     createMessage,
//     deleteMessageReceiver,
//     deleteMessageSender,
//     receiveMessage
// }