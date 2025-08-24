import json
import os
import boto3

TABLE_NAME = os.environ["ACCOUNT_TABLE_NAME"]

# Create DynamoDB client/resource
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

VALID_CATEGORIES = {"ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"}

def _json(body: dict, status: int = 200):
    return {
        "statusCode": status,
        "headers": {"content-type": "application/json"},
        "body": json.dumps(body),
    }

def _bad(msg: str, status: int = 400):
    return _json({"error": msg}, status)

def create_account(event, context):
    path = event.get("pathParameters") or {}
    book_id = path.get("bookId")
    if not book_id:
        return _bad("Missing bookId in path")

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return _bad("Invalid JSON body")

    code = str(body.get("code") or "").strip()
    name = (body.get("name") or "").strip()
    category = (body.get("category") or "").strip().upper()

    if not code or not name or category not in VALID_CATEGORIES:
        return _bad("'code', 'name', and valid 'category' are required")

    normal_side = body.get("normalSide") or (
        "DEBIT" if category in {"ASSET", "EXPENSE"} else "CREDIT"
    )

    item = {
        "pk": f"BOOK#{book_id}",
        "sk": f"ACCOUNT#{code}",
        "type": "account",
        "code": code,
        "name": name,
        "category": category,
        "normalSide": normal_side,
    }

    table().put_item(Item=item)
    return _json(item, 201)