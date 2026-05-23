/* eslint-disable no-undef */
import "dotenv/config"
import { getDb } from "../src/db.js"
import { CLUBS } from "../../src/data/clubs.js"

async function run() {
  const db = await getDb()
  const ops = CLUBS.map((club) => ({
    updateOne: {
      filter: { id: club.id },
      update: { $set: club },
      upsert: true,
    },
  }))

  if (ops.length > 0) {
    await db.collection("clubs").bulkWrite(ops)
  }

  console.log(`Seeded ${ops.length} clubs`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
