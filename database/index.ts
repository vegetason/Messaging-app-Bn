import { Sequelize } from "sequelize";
import dotenv from "dotenv"
import pg from "pg"

dotenv.config()
const databaseUrl=process.env.DATABASE_URL as any
const dbName=process.env.DB_NAME as any;
const dbUsername=process.env.DB_USERNAME as any;
const dbPassword=process.env.DB_PASSWORD as any

export const sequelize=new Sequelize(dbName,dbUsername,dbPassword,{
    dialect: "postgres",
    dialectModule: pg,
  });

  sequelize.authenticate()
  .then(() => console.log("Connected successfully"))
  .catch(err => console.error("Connection error:", err));