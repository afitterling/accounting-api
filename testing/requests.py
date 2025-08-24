import requests

API = "https://<your-api-id>.execute-api.<region>.amazonaws.com"  # replace with your SST api url

resp = requests.get(f"{API}/health")
print(resp.json())
