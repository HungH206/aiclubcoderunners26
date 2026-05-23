/* eslint-disable no-undef */
import "dotenv/config"
import { getDb } from "../src/db.js"

async function ensureCollection(name, options) {
  const db = await getDb()
  const collections = await db.listCollections({ name }).toArray()

  if (collections.length === 0) {
    await db.createCollection(name, options)
    return
  }

  if (options?.validator) {
    await db.command({ collMod: name, validator: options.validator, validationLevel: "moderate" })
  }
}

async function run() {
  await ensureCollection("clubs", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "id",
          "name",
          "shortName",
          "description",
          "website",
          "tags",
          "ethnicFocus",
          "majorFocus",
          "events",
          "officers",
          "category",
        ],
        properties: {
          id: { bsonType: "string" },
          name: { bsonType: "string" },
          shortName: { bsonType: "string" },
          description: { bsonType: "string" },
          website: { bsonType: "string" },
          tags: { bsonType: "array", items: { bsonType: "string" } },
          ethnicFocus: { bsonType: "array", items: { bsonType: "string" } },
          majorFocus: { bsonType: "array", items: { bsonType: "string" } },
          events: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["name", "date", "location"],
              properties: {
                name: { bsonType: "string" },
                date: { bsonType: "string" },
                location: { bsonType: "string" },
              },
            },
          },
          officers: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["role", "name"],
              properties: {
                role: { bsonType: "string" },
                name: { bsonType: "string" },
              },
            },
          },
          address: { bsonType: "string" },
          category: { bsonType: "string" },
        },
      },
    },
  })

  await ensureCollection("user_profiles", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["profile", "createdAt", "lastSeenAt"],
        properties: {
          userKey: { bsonType: "string" },
          profile: {
            bsonType: "object",
            required: ["name", "major", "ethnicity", "interests"],
            properties: {
              name: { bsonType: "string" },
              major: { bsonType: "string" },
              ethnicity: { bsonType: "string" },
              interests: { bsonType: "array", items: { bsonType: "string" } },
            },
          },
          createdAt: { bsonType: "date" },
          lastSeenAt: { bsonType: "date" },
          visitCount: { bsonType: "int" },
        },
      },
    },
  })

  await ensureCollection("visits", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["profile", "createdAt"],
        properties: {
          userKey: { bsonType: "string" },
          source: { bsonType: "string" },
          profile: {
            bsonType: "object",
            required: ["name", "major", "ethnicity", "interests"],
            properties: {
              name: { bsonType: "string" },
              major: { bsonType: "string" },
              ethnicity: { bsonType: "string" },
              interests: { bsonType: "array", items: { bsonType: "string" } },
            },
          },
          createdAt: { bsonType: "date" },
        },
      },
    },
  })

  const db = await getDb()
  await db.collection("clubs").createIndex({ id: 1 }, { unique: true })
  await db.collection("clubs").createIndex({ category: 1 })
  await db.collection("clubs").createIndex({ tags: 1 })
  await db.collection("user_profiles").createIndex({ userKey: 1 }, { unique: true, sparse: true })
  await db.collection("visits").createIndex({ createdAt: -1 })

  console.log("Database initialized")
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
