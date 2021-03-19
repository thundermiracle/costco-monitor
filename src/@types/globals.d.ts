/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly CostcoUser?: string;
    readonly CostcoPass?: string;
    readonly MailService?: string;
    readonly MailUser?: string;
    readonly MailPassword?: string;
    readonly MailTo?: string;
    readonly Urls?: string;
    readonly NO_SANDBOX?: string;
  }
}
