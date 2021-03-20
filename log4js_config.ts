import { join } from "path";

export default {
  appenders: {
    normal: {
      type: "file",
      filename: join(__dirname, "./logs/all.log"),
      pattern: ".yyyy-MM-dd",
      maxLogSize: 10000000,
    },
    console: {
      type: "console",
    },
  },
  categories: {
    dev: { appenders: ["normal", "console"], level: "info" },
    default: { appenders: ["normal"], level: "info" },
  },
};
