import path from "path";
import dotenv from "dotenv";

const pathToEnvVar = path.resolve(process.cwd(), "config/config.env");
dotenv.config({ path: pathToEnvVar });
