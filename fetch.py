import urllib.request
import sys

url = "https://api.superdesign.dev/v1/files/export/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNvcmRJZCI6Ijc1MjA5N2RhLWQ0Y2UtNGI0Mi04MWZkLTNmMmE4ZmE5YmI2ZSIsInR5cGUiOiJleHBvcnQiLCJpYXQiOjE3NjYzMjMzMjYsImV4cCI6MTc2NjMyMzkyNn0.vRGbK8I9SJDBHhN5iTQ07O7JewlprY0br70TE0GI93M"

try:
    req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0') 
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        print(content)
except Exception as e:
    print(f"Error: {e}")
