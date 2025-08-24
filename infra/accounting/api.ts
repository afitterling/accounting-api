import { accounting } from "../tables";

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
        args.environment = { ...(args.environment ?? {}) };
      },
    },
  },
});

// pro Route: link sauber setzen
api.route("GET /health", {
  handler: "packages/functions/src/utils.health",
  copyFiles: [{ from: "packages/functions/src/utils.py" }],
  runtime: "python3.11",
  environment: { ACCOUNT_TABLE_NAME: accounting.name },
  link: [accounting],
});

api.route("POST /books", {
  handler: "packages/functions/src/books.create_book",
  copyFiles: [{ from: "packages/functions/src/books.py" }],
  environment: { ACCOUNT_TABLE_NAME: accounting.name },
  runtime: "python3.11",
  link: [accounting],
});

api.route("GET /books", {
  handler: "packages/functions/src/books.index_books",
  copyFiles: [{ from: "packages/functions/src/books.py" }],
  environment: { ACCOUNT_TABLE_NAME: accounting.name },
  runtime: "python3.11",
  link: [accounting],
});

api.route("GET /books/{bookId}/accounts", {
  handler: "packages/functions/src/accounts.list_accounts",
  copyFiles: [{ from: "packages/functions/src/accounts.py" }],
  runtime: "python3.11",
  link: [accounting],
});

api.route("POST /books/{bookId}/accounts", {
  handler: "packages/functions/src/accounts.create_account",
  copyFiles: [{ from: "packages/functions/src/accounts.py" }],
  link: [accounting],
});

api.route("GET /books/{bookId}/entries", {
  copyFiles: [{ from: "packages/functions/src/entries.py" }],
  handler: "packages/functions/src/entries.list_entries",
  link: [accounting],
});

api.route("POST /books/{bookId}/entries", {
  copyFiles: [{ from: "packages/functions/src/entries.py" }],
  handler: "packages/functions/src/entries.create_entry",
  link: [accounting],
  transform: {}
});

api.route("GET /books/{bookId}/accounts/{code}/ledger", {
  copyFiles: [{ from: "packages/functions/src/ledger.py" }],
  handler: "packages/functions/src/ledger.get_ledger",
  link: [accounting],
});

console.log(api.route);