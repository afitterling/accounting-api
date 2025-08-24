import os
import json
import uuid
from datetime import datetime, timezone

import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

#from sst import Resource

# Get the table name from env
TABLE_NAME = os.environ["ACCOUNT_TABLE_NAME"]

# Create DynamoDB client/resource
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def _json_response(status, body):
    return {"statusCode": status, "body": json.dumps(body)}


def create_book(event, context):
    #print(json.dumps(dict(os.environ), indent=2))
    #return
    body_raw = event.get("body") if isinstance(event, dict) else None
    try:
        payload = json.loads(body_raw) if body_raw else {}
    except json.JSONDecodeError:
        return _json_response(400, {"message": "Invalid JSON in request body"})

    name = payload.get("name") or "Untitled"
    book_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user_id = 1

    item = {
        "pk": f"user#{user_id}",
        "sk": f"transaction#{now}",
        "type": "Book",
        "id": book_id,
        "name": name,
        "createdAt": now,
        "updatedAt": now,
        # Useful for listing books via GSI1
        "gsi1pk": "BOOK",
        "gsi1sk": now,
    }

    try:
        table.put_item(
            Item=item,
            ConditionExpression="attribute_not_exists(pk) AND attribute_not_exists(sk)",
        )
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code")
        if code == "ConditionalCheckFailedException":
            return _json_response(409, {"message": "Book already exists"})
        return _json_response(
            500,
            {"message": "Failed to create book", "error": e.response.get("Error", {}).get("Message")},
        )

    return _json_response(201, {"id": book_id, "name": name})

def index_books(event, context):
    """Listet alle Bücher auf."""
    # User-ID aus Query-String oder Event holen
    user_id = 1
    if isinstance(event, dict):
        # Versuche user_id aus Query-String zu holen
        params = event.get("queryStringParameters") or {}
        #user_id = params.get("user_id")
    if not user_id:
        user_id = 1  # Default oder aus Auth
    try:
        response = table.query(
            KeyConditionExpression=Key("pk").eq(f"user#{user_id}") & Key("sk").begins_with("transaction#"),
        )
        books = response.get("Items")
        print(books)
        #books = [b for b in books if b["type"] == "Book"]
        return _json_response(200, books)
    except ClientError as e:
        return _json_response(500, {"message": str(e)})

