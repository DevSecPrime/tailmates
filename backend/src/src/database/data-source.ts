import dotenv from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
dotenv.config();

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.ENVIRONMENT === 'production' ? false : true,
  logging: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOption);

dataSource
  .initialize()
  .then(() => {
    console.warn('Database connected');
  })
  .catch(error => {
    console.warn('Database connection failed');
    console.warn(error);
  });

export default dataSource;
