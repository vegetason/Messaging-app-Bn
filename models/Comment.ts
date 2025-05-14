'use strict';

import { sequelize } from "../database";
import { DataTypes, Model } from "sequelize";
import Post from "./Post";

export interface CommentAttributes {
  id:string;
  comment:string;
  postId:string;
  writer:string
}

  class Comment extends Model <CommentAttributes> {
    declare id:string
    declare title: string;
    declare comment:string;
    declare writer:string
    declare postId:string;

    static associate() {
      Comment.belongsTo(Post, { foreignKey: 'postId' })
    }
  
  }
  Comment.init({
    id:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      onDelete:"CASCADE",
      primaryKey:true,
      allowNull:false
    },
    comment: {
      type:DataTypes.STRING,
      allowNull :false
    },
    writer: {
      type:DataTypes.STRING,
      allowNull:false
    },
    postId:{
      type:DataTypes.UUID,
      references:{
        model:"Post",
        key:"id"
      },
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });


  export default Comment