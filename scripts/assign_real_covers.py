import json
import re

path = 'src/data/booksCatalog.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

prefix = "import { Book } from '../types/book';\n\nexport const BOOKS_CATALOG: Book[] = "
start = text.find(prefix) + len(prefix)
books = json.loads(text[start:].rstrip(';\n'))

local_covers = {
    'form-void': '/images/book_cover_form_void_1792609936178.jpg',
    'the-zen-garden': '/images/book_cover_zen_garden_1792610457442.jpg',
    'meditations-on-time': '/images/book_cover_meditations_time_1792609937161.jpg',
    'the-quiet-hour': '/images/book_cover_quiet_hour_1792609936232.jpg',
    'thinking-machines': '/images/book_cover_thinking_machines_1792609937276.jpg',
    'celestial-mechanics': '/images/book_cover_celestial_mechanics_1792610457608.jpg'
}

count_local = 0
count_isbn = 0

for b in books:
    b_id = b.get('id')
    if b_id in local_covers:
        b['coverImage'] = local_covers[b_id]
        count_local += 1
    elif b.get('isbn'):
        clean_isbn = re.sub(r'[^0-9X]', '', b['isbn'], flags=re.I)
        b['coverImage'] = f"https://covers.openlibrary.org/b/isbn/{clean_isbn}-L.jpg"
        count_isbn += 1
    else:
        b['coverImage'] = ''

print(f"Assigned {count_local} local covers and {count_isbn} OpenLibrary ISBN covers.")

new_content = prefix + json.dumps(books, indent=2, ensure_ascii=False) + ';\n'
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Saved updated booksCatalog.ts successfully!")
