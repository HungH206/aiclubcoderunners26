/* eslint-disable no-undef */
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "clubmatch"

if (!uri) {
  throw new Error("Missing MONGODB_URI. Add it to server/.env")
}

let client
let db

export async function getDb() {
  if (db) return db

  client = new MongoClient(uri)
  await client.connect()
  db = client.db(dbName)
  return db
}
