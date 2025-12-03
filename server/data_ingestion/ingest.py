import csv
from datetime import datetime
import json

data = []

def convert_date(date_str):
    if not date_str:
        return None
    return datetime.strptime(date_str, "%B %d, %Y").strftime("%Y-%m-%d")  # convert to string for JSON

with open('netflix_titles.csv', encoding='utf-8') as f:
    csvFile = csv.reader(f)
    fields = next(csvFile)
    
    for line in csvFile:
        obj = {}
        for k, v in zip(fields, line):
            if k == 'date_added':
                v = convert_date(v.strip())
            elif k == 'release_year':
                v = int(v)
            obj[k] = v
        data.append(obj)

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
