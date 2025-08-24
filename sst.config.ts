/// <reference path="./.sst/platform/config.d.ts" />

export default $config({

  app(input) {
    return {
      name: "accounting-202508",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {

    const storage = await import("./infra/storage");
    //await import("./infra/api");
    const { api } = await import('./infra/accounting/api');

    const { accounting } = await import('./infra/tables');

    const secret = new sst.Secret("MySecret", "my-secret-placeholder-value");

    return {
      //MyBucket: storage.bucket.name,
      //api: api || "no url",
      accountingTable: accounting.name,
      api: api.url,
      secret: secret.name,
      secretVal: secret.value
    };
  },
});
