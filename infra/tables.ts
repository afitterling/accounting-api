export const accounting = new sst.aws.Dynamo("AccountingTable", {
    fields: { pk: "string", sk: "string", gsi1pk: "string", gsi1sk: "string", gsi2pk: "string", gsi2sk: "string" },
    primaryIndex: { hashKey: "pk", rangeKey: "sk" },
    globalIndexes: {
        GSI1: { hashKey: "gsi1pk", rangeKey: "gsi1sk" },
        GSI2: { hashKey: "gsi2pk", rangeKey: "gsi2sk" },
    },
});
