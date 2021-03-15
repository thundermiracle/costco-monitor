/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly COSTCO_USER?: string;
    readonly COSTCO_PASS?: string;
  }
}
