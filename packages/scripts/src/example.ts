import { Resource } from "sst";
import { Example } from "@accounting-202508/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
