import { DataSource } from "typeorm";
import {
  getDatabaseConfig,
  createDataSource,
} from "./src/config/database.config";

// This file is used by TypeORM CLI
const config = getDatabaseConfig();
export default createDataSource(config);
