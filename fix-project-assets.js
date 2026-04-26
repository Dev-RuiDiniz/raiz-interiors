const fs = require('node:fs')
const path = require('node:path')
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

function loadUpdates() {
  const mappingPath = path.join(__dirname, 'tmp', 'asset-path-map.json')

  if (!fs.existsSync(mappingPath)) {
    throw new Error(`Asset path map not found at ${mappingPath}`)
  }

  const raw = JSON.parse(fs.readFileSync(mappingPath, 'utf8'))

  return [
    ...Object.entries(raw.directories || {}),
    ...Object.entries(raw.files || {}),
  ].sort((left, right) => right[0].length - left[0].length)
}

async function replaceInLayouts(from, to) {
  const layouts = await client.query(
    `SELECT id, draft::text AS draft_text, published::text AS published_text FROM "PageSectionLayout"`
  )

  for (const row of layouts.rows) {
    const draft = row.draft_text.replaceAll(from, to)
    const published = row.published_text.replaceAll(from, to)

    if (draft !== row.draft_text || published !== row.published_text) {
      await client.query(
        `UPDATE "PageSectionLayout" SET draft = $2::jsonb, published = $3::jsonb WHERE id = $1`,
        [row.id, draft, published]
      )
    }
  }
}

async function run() {
  const updates = loadUpdates()
  await client.connect()

  for (const [from, to] of updates) {
    await client.query(
      `UPDATE "Project" SET "coverImage" = REPLACE("coverImage", $1, $2) WHERE "coverImage" LIKE '%' || $1 || '%'`,
      [from, to]
    )
    await client.query(
      `UPDATE "Service" SET "coverImage" = REPLACE("coverImage", $1, $2) WHERE "coverImage" LIKE '%' || $1 || '%'`,
      [from, to]
    )
    await client.query(
      `UPDATE "ProjectImage" SET "url" = REPLACE("url", $1, $2) WHERE "url" LIKE '%' || $1 || '%'`,
      [from, to]
    )
    await client.query(
      `UPDATE "ServiceImage" SET "url" = REPLACE("url", $1, $2) WHERE "url" LIKE '%' || $1 || '%'`,
      [from, to]
    )
    await replaceInLayouts(from, to)
  }

  console.log(`Asset paths updated with ${updates.length} replacements.`)
  await client.end()
}

run().catch(async (error) => {
  console.error(error)
  try {
    await client.end()
  } catch {}
  process.exit(1)
})
