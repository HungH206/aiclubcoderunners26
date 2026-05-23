/* eslint-disable no-undef */
import "dotenv/config"
import express from "express"
import cors from "cors"
import clubsRouter from "./routes/clubs.js"
import visitsRouter from "./routes/visits.js"

const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json({ limit: "1mb" }))

app.get("/health", (_req, res) => res.json({ ok: true }))
app.use("/api/clubs", clubsRouter)
app.use("/api/visits", visitsRouter)

app.listen(port, () => {
  console.log(`Server listening on :${port}`)
})
