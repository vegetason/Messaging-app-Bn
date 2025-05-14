'use strict';

import { Sequelize } from 'sequelize';
import { sequelize } from '../database';
import User from './User';
import Post from './Post';
import Comment from './Comment';

interface Models {
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
  [key: string]: any; 
}

const models: Models = {
  User,
  Post,
  Comment
};

Object.keys(models).forEach((modelName: string) => {
  if ('associate' in models[modelName] && typeof models[modelName].associate === 'function') {
    models[modelName].associate(models);
  }
});

export { sequelize, Sequelize, User, Post, Comment };