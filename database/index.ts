import { Sequelize } from "sequelize";
import dotenv from "dotenv"
import pg from "pg"

dotenv.config()
const databaseUrl=process.env.DATABASE_URL as any

export const sequelize=new Sequelize(databaseUrl, {
    dialect: "postgres",
    dialectModule: pg,
  });