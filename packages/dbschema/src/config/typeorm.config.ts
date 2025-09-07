import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { createDatabaseConfig } from "./database.config";

// ---- Logging helper ----
function logTypeormConfig(phase: string, config: any) {
  // Make passwords/keys less visible in logs
  const safeConfig = {
    ...config,
    password: config.password ? "[REDACTED]" : undefined,
  };
  console.log(
    `[TypeORM CONFIG] (${phase})`,
    JSON.stringify(safeConfig, null, 2)
  );
}

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const config = {
      host: configService.get("DATABASE_HOST", "localhost"),
      port: parseInt(configService.get("DATABASE_PORT", "5432")), // Ensure this is a number
      username: configService.get("DATABASE_USERNAME", "trader"),
      password: configService.get("DATABASE_PASSWORD", "safe"),
      database: configService.get("DATABASE_NAME", "trading"),
      ssl: configService.get("DATABASE_SSL", "false") === "true",
      logging: configService.get("DATABASE_LOGGING", "false") === "true",
      synchronize:
        configService.get("DATABASE_SYNCHRONIZE", "false") === "true",
      migrationsRun:
        configService.get("DATABASE_MIGRATIONS_RUN", "false") === "true",
    };
    logTypeormConfig("forRootAsync", config);
    return createDatabaseConfig(config);
  },
};

// For TypeORM CLI data source
import { createDataSource, getDatabaseConfig } from "./database.config";

// --- Log CLI-side config for migrations as well ---
const cliConfig = getDatabaseConfig();
logTypeormConfig("migration/cli", cliConfig);

// This is used by TypeORM CLI for migrations
export default createDataSource(cliConfig);

// import { ConfigService } from "@nestjs/config";
// import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
// import { createDatabaseConfig } from "./database.config";

// export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
//   inject: [ConfigService],
//   useFactory: async (configService: ConfigService) => {
//     return createDatabaseConfig({
//       host: configService.get("DATABASE_HOST", "localhost"),
//       port: configService.get("DATABASE_PORT", 5432),
//       username: configService.get("DATABASE_USERNAME", "trader"),
//       password: configService.get("DATABASE_PASSWORD", "safe"),
//       database: configService.get("DATABASE_NAME", "trading"),
//       ssl: configService.get("DATABASE_SSL", "false") === "true",
//       logging: configService.get("DATABASE_LOGGING", "false") === "true",
//       synchronize:
//         configService.get("DATABASE_SYNCHRONIZE", "false") === "true",
//       migrationsRun:
//         configService.get("DATABASE_MIGRATIONS_RUN", "false") === "true",
//     });
//   },
// };

// // For TypeORM CLI data source
// import { DataSource } from "typeorm";
// import { createDataSource, getDatabaseConfig } from "./database.config";

// // This is used by TypeORM CLI for migrations
// export default createDataSource(getDatabaseConfig());
