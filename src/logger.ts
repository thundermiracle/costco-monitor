import { configure, getLogger } from "log4js";
import path from "path";
import { readFileSync } from "fs";

const configPath = path.join(__dirname, "../log4js_config.json");
const log4jsConfigString = readFileSync(configPath, { encoding: "utf8" });

configure(JSON.parse(log4jsConfigString));

const loggerCategory =
  process.env.NODE_ENV === "development" ? "dev" : "default";
const logger = getLogger(loggerCategory);

export default logger;
