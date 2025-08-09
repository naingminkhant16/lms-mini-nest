import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { runRoleSeeder } from './seeders/role.seeder';
import { env } from 'process';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [__dirname + '/../**/entities/*.entity.{js,ts}'],
  synchronize: false,
});

AppDataSource.initialize()
  .then(async () => {
    await runRoleSeeder(AppDataSource);
    await AppDataSource.destroy();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error during seeding', error);
    process.exit(1);
  });
