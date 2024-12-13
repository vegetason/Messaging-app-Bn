'use strict';

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import Post from "./Post";
export interface likeAttributes{
  id:string;
  likes: string;
  writer: string,
  postId: string,
}
  class Like extends Model <likeAttributes> {
    declare id:string
    declare likes:string;
    declare postId:string;
    declare writer: string
    static associate(models: any) {
      Like.belongsTo(Post,{foreignKey:"postId"})
    }
  }
  Like.init({
    id:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      onDelete:"CASCADE",
      allowNull:false,
      primaryKey:true
    },
    likes: {
      type:DataTypes.STRING,
    },
    writer: {
      type:DataTypes.STRING,
      allowNull:false
    },
    postId: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Like',
  });

  export default Like
