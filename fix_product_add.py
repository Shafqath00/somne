import re

file = 'c:/Users/newbi/Documents/projects/WEbsite/mattress_site/somne/src/pages/admin/ProductAdd.tsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r"catch\s*\((.*?)\)\s*\{\s*console\.error\(\1\);\s*toast\.error\('Failed to upload variant images'\);\s*\}",
    r"catch (\1) {\n            console.error(\1);\n            toast.dismiss();\n            toast.error('Failed to upload variant images');\n        }",
    content
)

content = re.sub(
    r"catch\s*\((.*?)\)\s*\{\s*console\.error\(\1\);\s*toast\.error\('Failed to upload mattress images'\);\s*\}",
    r"catch (\1) {\n            console.error(\1);\n            toast.dismiss();\n            toast.error('Failed to upload mattress images');\n        }",
    content
)

content = re.sub(
    r"catch\s*\((.*?)\)\s*\{\s*console\.error\(\1\);\s*toast\.error\('Failed to upload color images'\);\s*\}",
    r"catch (\1) {\n            console.error(\1);\n            toast.dismiss();\n            toast.error('Failed to upload color images');\n        }",
    content
)

content = re.sub(
    r"catch\s*\((.*?)\)\s*\{\s*console\.error\(\1\);\s*toast\.error\('Upload failed'\);\s*\}",
    r"catch (\1) {\n            console.error(\1);\n            toast.dismiss();\n            toast.error('Upload failed');\n        }",
    content
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
