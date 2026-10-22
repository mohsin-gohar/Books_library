import re
import json

path = 'src/data/booksCatalog.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Match export const BOOKS_CATALOG: Book[] = [ ... ];
# Find where the array starts
prefix = "import { Book } from '../types/book';\n\nexport const BOOKS_CATALOG: Book[] = "
start_idx = text.find(prefix)
if start_idx == -1:
    print("Could not find prefix")
    exit(1)

json_str = text[start_idx + len(prefix):].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1].strip()

books = json.loads(json_str)
print("Loaded books:", len(books))

featured_covers = {
    'form-void': '/images/book_cover_form_void_1792609936178.jpg',
    'the-zen-garden': '/images/book_cover_zen_garden_1792610457442.jpg',
    'meditations-on-time': '/images/book_cover_meditations_time_1792609937161.jpg',
    'the-quiet-hour': '/images/book_cover_quiet_hour_1792609936232.jpg',
    'thinking-machines': '/images/book_cover_thinking_machines_1792609937276.jpg',
    'celestial-mechanics': '/images/book_cover_celestial_mechanics_1792610457608.jpg'
}

for b in books:
    b_id = b.get('id')
    if b_id in featured_covers:
        b['coverImage'] = featured_covers[b_id]
        print(f"Set cover for {b_id}: {b['coverImage']}")
    else:
        b['coverImage'] = ''

new_content = prefix + json.dumps(books, indent=2, ensure_ascii=False) + ';\n'
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated booksCatalog.ts!")
