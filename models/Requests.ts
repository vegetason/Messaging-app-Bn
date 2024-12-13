'use strict';
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface RequestAttributes{
  id:string;
  status:string;
  receiverId:string;
  senderId:string
}
class Requests extends Model <RequestAttributes> {
  declare id:string;
  declare status:string;
  declare receiverId:string;
  declare senderId:string
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
    type:DataTypes.STRING,
    allowNull:false
  },
  receiverId:{
    type: DataTypes.STRING,
    allowNull:false
  }
}, {
  sequelize,
  modelName: 'Requests',
});


export default Requests