import { table } from "../tables";

/* import { bucket } from "./storage";

export const myApi = new sst.aws.Function("MyApi", {
  url: true,
  link: [bucket],
  handler: "packages/functions/src/api.handler"
});
 */
export const api = new sst.aws.ApiGatewayV2("AccountingApi", {
  transform: {
    route: {
      handler: (args) => {
        args.runtime ??= "python3.11";
        args.environment = { ...(args.environment ?? {}), TABLE_NAME: table.name };
      },
    },
  },
});

// pro Route: link sauber setzen
api.route("GET /health", {
  handler: "packages/functions/src/acc_fns/utils.health",
  runtime: "python3.11",
  link: [table],
});

api.route("POST /books", {
  handler: "packages/functions/src/books.create_book",
  link: [table],
});

api.route("GET /books/{bookId}/accounts", {
  handler: "packages/functions/src/accounts.list_accounts",
  link: [table],
});

api.route("POST /books/{bookId}/accounts", {
  handler: "packages/functions/src/accounts.create_account",
  link: [table],
});

api.route("GET /books/{bookId}/entries", {
  handler: "packages/functions/src/entries.list_entries",
  link: [table],
});

api.route("POST /books/{bookId}/entries", {
  handler: "packages/functions/src/entries.create_entry",
  link: [table],
});

api.route("GET /books/{bookId}/accounts/{code}/ledger", {
  handler: "packages/functions/src/ledger.get_ledger",
  link: [table],
});

console.log(api.route);