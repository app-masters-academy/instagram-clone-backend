import { ConnectionOptions } from 'typeorm';

// You can load you .env file here synchronously using dotenv package (not installed here),
import * as dotenv from 'dotenv';
if (process.env.NODE_ENV != 'production') {
  dotenv.config();
}
// You can also make a singleton service that load and expose the .env file content.
// ...

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.js'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'react_for_humans',
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
  extra: {
    ssl: true,
    rejectUnauthorized: false,
  },
};

export = config;
