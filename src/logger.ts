import { configure, getLogger, Configuration, FileAppender } from "log4js";
import path from "path";
import { readFileSync } from "fs";

const configPath = path.join(__dirname, "../log4js_config.json");
const log4jsConfigString = readFileSync(configPath, { encoding: "utf8" });
const config = JSON.parse(log4jsConfigString) as Configuration;

// change filePath to absolute path
const appendar = config.appenders.normal as FileAppender;
appendar.filename = path.join(__dirname, "../", appendar.filename);

configure(config);

const loggerCategory =
  process.env.NODE_ENV === "development" ? "dev" : "default";
const logger = getLogger(loggerCategory);

export default logger;
