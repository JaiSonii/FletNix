import pandas as pd
from pymongo import MongoClient
import json
import os

MONGO_URI = "MONGO_URL" 
DB_NAME = "fletnix"

def load_data():
    csv_file = "netflix_titles.csv" 
    
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found. Please place the CSV in the directory.")
        return

    print("Reading CSV...")
    df = pd.read_csv(csv_file)
    
    df = df.fillna("")

    records = df.to_dict(orient="records")

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db["shows"]

    print("Inserting data into MongoDB...")
    collection.delete_many({})
    collection.insert_many(records)
    print(f"Successfully inserted {len(records)} shows.")

if __name__ == "__main__":
    load_data()