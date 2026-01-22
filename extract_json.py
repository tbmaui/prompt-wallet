import json
import os

files_to_extract = {
    '/src/components/PromptCard.tsx': 'temp_GlassCard.tsx',
    '/src/components/PromptGrid.tsx': 'temp_GlassGrid.tsx',
    '/src/Component.tsx': 'temp_GlassComponent.tsx'
}

try:
    with open('temp_component.json', 'r', encoding='utf-16') as f:
        data = json.load(f)
        for key, target in files_to_extract.items():
            if key in data:
                with open(target, 'w', encoding='utf-8') as out:
                    out.write(data[key])
                print(f"Extracted {key} to {target}")
            else:
                print(f"Key {key} not found")
except Exception as e:
    print(f"Error: {e}")
