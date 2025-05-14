'use strict';
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface RequestAttributes{
  id:string;
  status:string;
  receiverId:string;
  senderId:string;
  declineExpirationTime:Date
}
class Requests extends Model <RequestAttributes> {
  declare id:string;
  declare status:string;
  declare receiverId:string;
  declare senderId:string;
  declare declineExpirationTime:Date
  static associate() {
  }
}

Requests.init({
  id:{
    type:DataTypes.UUID,
    allowNull:false,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true,
    onDelete:"CASCADE"
  },
  status: {
    type:DataTypes.STRING,
    allowNull:false
  },
  senderId: {
    type:DataTypes.UUID,
    allowNull:false
  },
  receiverId:{
    type: DataTypes.UUID,
    allowNull:false
  },
  declineExpirationTime:{
    type:DataTypes.DATE,
  }
}, {
  sequelize,
  modelName: 'Requests',
});


export default Requests