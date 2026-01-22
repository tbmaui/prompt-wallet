import json

try:
    with open('temp_component.json', 'r', encoding='utf-16') as f:
        data = json.load(f)
        print("Keys:", list(data.keys()))
        for key, value in data.items():
            print(f"Key: {key}, Length: {len(str(value))}")
            if len(str(value)) < 500:
                print(f"Value content: {value}")
except Exception as e:
    print(f"Error: {e}")
