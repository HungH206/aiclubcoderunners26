from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Replace the placeholder with your Atlas connection string
uri = "mongodb://localhost:27017/"

# Create a MongoClient with a MongoClientOptions object to set the Stable API version
client = MongoClient(uri)

try:
    # Connect the client to the server (optional starting in v4.7)
    # client.connect()

    # Send a ping to confirm a successful connection
    client.admin.command({'ping': 1})
    print("Pinged your deployment. You successfully connected to MongoDB!")

    # ⭐ SELECT DATABASE (no parentheses)
    db = client["HCCHackathon5_22-23_2026"]   # or whatever your DB name is

    # ⭐ SELECT COLLECTION (no parentheses)
    users = db["sample_collection"]

    # Test query
    print(users.find_one())

finally:
    # Ensures that the client will close when you finish/error
    client.close()
