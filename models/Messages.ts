'use strict';
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface messagesAttribute{
  id:string
  text:string;
  senderId:string;
  receiverId:string;
  files:string[]
}
class Messages extends Model <messagesAttribute> {
  declare id:string;
  declare text:string;
  declare senderId:string;
  declare receiverId:string;
  declare files:string[]
}
Messages.init({
  id:{
    type:DataTypes.UUID,
    allowNull:false,
    defaultValue:DataTypes.UUIDV4,
    onDelete:"CASCADE",
    primaryKey:true
  },
  text:{
    type: DataTypes.STRING,
    allowNull:false
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull:false
  },
  receiverId: {
    type: DataTypes.STRING,
    allowNull:false
  },
  files:{
    type:DataTypes.ARRAY(DataTypes.STRING)
  }
}, {
  sequelize,
  modelName: 'Messages',
});


export default Messages