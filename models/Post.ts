'use strict';
import { sequelize } from "../database";
import { DataTypes, Model, Sequelize } from "sequelize";
import User from "./User";
import Comment from "./Comment";
import Like from "./Like";

export interface PostAttributes {
  id:string;
  title: string;
  image: string[];
  description: string;
  author: string;
  UserId: string;
}

class Post extends Model <PostAttributes> {
  declare title: string;
  declare image: string[];
  declare description:string;
  declare author:string;
  declare UserId:string;
  static associate() {
    Post.belongsTo(User, { foreignKey: 'UserId' })
    Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
    Post.hasMany(Like,{foreignKey:'postId',as:'Likes'})
  }

  
}
Post.init({
  id:{
    type: DataTypes.UUID,
    allowNull:false,
    primaryKey:true,
    defaultValue:DataTypes.UUIDV4,
    onDelete:"CASCADE"
  },
  title: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:true
    }
  },
  image: DataTypes.ARRAY(DataTypes.STRING),
  description:{
    type: DataTypes.STRING
  },
  author: {
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:true
    }
  },
  UserId:{
    type:DataTypes.UUID,
    allowNull:false,
    references:{
      model:"User",
      key:"id"
    },
    validate:{
      notEmpty:true
    }
  }
}, {
  sequelize,
  modelName: 'Post',
});

export default Post

