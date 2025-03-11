'use strict';
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface UserAttributes {
  id:string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  freinds: any[]; 
  role:string;
  verified:boolean;
  phone:string
}

export type userCreationAttribute= Optional<UserAttributes, 'id'>;
class User extends Model <UserAttributes> {
  declare id:string;
  declare firstName: string;
  declare lastName: string;
  declare userName: string;
  declare email: string;
  declare password: string;
  declare role:string;
  declare freinds: any[];
  declare verified:boolean;
  declare phone:string;
  static associate(models: any) {
  }
}

User.init({
  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    allowNull:false,
    primaryKey:true,
    onDelete:"CASCADE"
  },
  firstName: {
    type:DataTypes.STRING,
    allowNull:false,
  },
  lastName: {
    type:DataTypes.STRING,
    allowNull:false
  },
  userName: {
    type:DataTypes.STRING,
    allowNull:false
  },
  email: {
    type:DataTypes.STRING,
    allowNull:false
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  role:{
    type:DataTypes.STRING,
    allowNull:false
  },
  freinds:{
    type:DataTypes.ARRAY(DataTypes.STRING)
  },
  phone:{
    type:DataTypes.STRING,
    allowNull:false
  },
  verified:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  }
}, {
  sequelize,
  modelName: 'User',
});


export default User
