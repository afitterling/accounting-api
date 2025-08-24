import sst
from datetime import datetime, timezone
import os
#import pprint
import json
#import sst
#from sst import Resource
import boto3

def health(event, context):
    #table_name = os.environ["table"]
    now = datetime.now(timezone.utc).isoformat()  # e.g. "2025-08-24T15:22:10+00:00"
    print(f"[{now}] health check invoked")
    print(json.dumps(dict(os.environ), indent=2))
    print(boto3.__version__)
    #pprint(os.environ.items())
    #print(Resource)
    print(event)
    print(context)
    #print(os.environ["ACCOUNTING_TABLE_NAME"])

    return {
        "statusCode": 200,
        "body": f"ok - {now}"
    }