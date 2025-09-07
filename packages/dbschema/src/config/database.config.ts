import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import { entities } from "../entities";

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
  logging?: boolean;
  synchronize?: boolean;
  migrationsRun?: boolean;
}

export const createDatabaseConfig = (
  config: DatabaseConfig
): TypeOrmModuleOptions => {
  return {
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    ssl: config.ssl,
    logging: config.logging || false,
    synchronize: config.synchronize || false, // Never true in production
    migrationsRun: config.migrationsRun || false,
    entities,
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    migrationsTableName: "migrations",
    retryAttempts: 3,
    retryDelay: 3000,
    autoLoadEntities: true,
    // Connection pool settings
    extra: {
      max: 20, // Maximum number of connections in pool
      min: 5, // Minimum number of connections in pool
      acquire: 30000, // Maximum time to get connection
      idle: 10000, // Maximum time connection can be idle
      // Connection retry logic
      retry: {
        max: 3,
        timeout: 5000,
        match: [/ConnectionError/],
      },
    },
  };
};
export const createDataSource = (config: DatabaseConfig): DataSource => {
  const options: DataSourceOptions = {
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    ssl: config.ssl,
    logging: config.logging || false,
    synchronize: false, // Always false for CLI
    entities,
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    migrationsTableName: "migrations",
  };

  return new DataSource(options);
};

// Helper function to create database connection
export const createDatabaseConnection = async (
  config: DatabaseConfig
): Promise<DataSource> => {
  const dataSource = createDataSource(config);

  try {
    await dataSource.initialize();
    console.log("Database connection established successfully");
    return dataSource;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

// Environment-based configuration factory
export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USERNAME || "trader",
    password: process.env.DATABASE_PASSWORD || "safe",
    database: process.env.DATABASE_NAME || "trading",
    ssl: process.env.DATABASE_SSL === "true",
    logging: process.env.DATABASE_LOGGING === "true",
    synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
    migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === "true",
  };
};

// export const getDatabaseConfig = (): DatabaseConfig => {
//   return {
//     host: process.env.DB_HOST || "localhost",
//     port: parseInt(process.env.DB_PORT || "5432"),
//     username: process.env.POSTGRES_USER || "trader",
//     password: process.env.POSTGRES_PASSWORD || "safe",
//     database: process.env.POSTGRES_DB || "trading",
//     ssl: process.env.DB_SSL === "true",
//     logging: process.env.DB_LOGGING === "true",
//     synchronize: process.env.DB_SYNCHRONIZE === "true",
//     migrationsRun: process.env.DB_MIGRATIONS_RUN === "true",
//   };
// };
