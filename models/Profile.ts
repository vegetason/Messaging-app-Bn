'use strict';
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import User from "./User";

export interface ProfileAttributes{
  id:string
  firstName:string;
  lastName:string;
  userName:string;
  telephone:string;
  profileImage:string;
  address:string;
  email:string;
  SomethingAboutYourself:string;
  userId:string
}

class Profile extends Model <ProfileAttributes> {
  
  declare id:string;
  declare firstName:string;
  declare lastName:string;
  declare userName:string;
  declare telephone:string;
  declare profileImage:string;
  declare address:string;
  declare email:string;
  declare SomethingAboutYourself:string;
  declare userId:string

  static associate(models: any) {
    Profile.belongsTo(User,{foreignKey:"userId"})
  }
}
Profile.init({
  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    allowNull:false,
    onDelete:"CASCADE",
    primaryKey:true
  },
  firstName: {
    type:DataTypes.STRING,
    allowNull:false
  },
  lastName: {
    type:DataTypes.STRING,
    allowNull:false
  },
  userName: {
    type:DataTypes.STRING,
    allowNull:false
  },
  telephone: {
    type:DataTypes.STRING,
  },
  profileImage: {
    type:DataTypes.STRING,
  },
  address: {
    type:DataTypes.STRING,
  },
  email: {
    type:DataTypes.STRING,
    allowNull:false
  },
  SomethingAboutYourself: {
    type:DataTypes.STRING,
  },
  userId:{
    type:DataTypes.STRING,
    allowNull:false
  }
}, {
  sequelize,
  modelName: 'Profile',
});
  
export default Profile

