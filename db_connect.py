from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Replace the placeholder with your Atlas connection string
uri = "mongodb://localhost:27017/"
#Fillipe URi: "mongodb://localhost:27017/"
#George URi: "mongodb+srv://georgeclub:<db_password>@cluster0.26mkufb.mongodb.net/?appName=Cluster0"
#Hung uri: mongodb+srv://hoanghung_db_user:<db_password>@cluster0.sj3ip0z.mongodb.net/?appName=Cluster0

# Connect using PyMongo's native TLS options
client = MongoClient(uri)

try:
    # Connect the client to the server (optional starting in v4.7)
    #client.connect()

    # Send a ping to confirm a successful connection
    client.admin.command({'ping': 1})
    print("Pinged your deployment. You successfully connected to MongoDB!")

    # ⭐ SELECT DATABASE (no parentheses)
    db = client["hoanghung_db_user"]   # or whatever your DB name is
    #Fillipe DB name: HCCHackathon5_22-23_2026
    #George DB name: georgeclub


    # ⭐ SELECT COLLECTION (no parentheses)
    users = db["sample_collection"]

    # Test query
    print(users.find_one())

except Exception as e:
    print(f"Error connecting or querying: {e}")

finally:
    # Ensures that the client will close when you finish/error
    client.close()
