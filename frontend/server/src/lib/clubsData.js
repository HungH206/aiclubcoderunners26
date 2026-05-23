import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const sharedClubsPath = path.resolve(currentDir, "../../../../Backend/data/clubs.json")

export async function loadSharedClubs() {
  const raw = await readFile(sharedClubsPath, "utf8")
  return JSON.parse(raw)
}
