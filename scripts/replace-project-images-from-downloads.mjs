import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd(), '..')
const downloadsBase = 'C:/Users/Rafael/Downloads/wetransfer_beach-house-troia-zip_2026-03-28_0119'
const targetBase = path.join(process.cwd(), 'public', '2026', 'projects')
const dataPath = path.join(repoRoot, 'data', 'admin-projects.json')

const folderMap = [
  {
    slug: 'summer-house-comporta',
    sourceFolder: 'SUMMER HOUSE COMPORTA',
    targetFolder: 'summer_house_comporta',
  },
  {
    slug: 'contemporary-city-house',
    sourceFolder: 'CONTEMPORARY CITY HOUSE',
    targetFolder: 'contemporary_city_house',
  },
  {
    slug: 'elegant-timeless-duplex',
    sourceFolder: 'ELEGANT & TIMELESS DUPLEX',
    targetFolder: 'elegant_and_timeless_duplex',
  },
  {
    slug: 'beach-house-troia',
    sourceFolder: 'BEACH HOUSE TROIA',
    targetFolder: 'beach_house_troia',
  },
  {
    slug: 'pombaline-restoration-principe-real',
    sourceFolder: 'PRÍNCIPE REAL POMBALINE RESTORATION',
    targetFolder: 'principe_real_pombaline_restoration',
  },
  {
    slug: 'rural-retreat',
    sourceFolder: 'RURAL RETREAT',
    targetFolder: 'rural_retreat',
  },
  {
    slug: 'store-restauration-atelier',
    sourceFolder: 'STORE & RESTAURATION ATELIER',
    targetFolder: 'store_and_restauration_atelier',
  },
]

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function normalizeSort(value) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\w.\-]+/g, '_')
}

async function resolveActualSourceDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const childDirectories = entries.filter((entry) => entry.isDirectory())

  if (childDirectories.length === 1) {
    return path.join(dir, childDirectories[0].name)
  }

  return dir
}

async function listImageFiles(dir) {
  const actualDir = await resolveActualSourceDir(dir)
  const entries = await fs.readdir(actualDir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => allowedExtensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => normalizeSort(a).localeCompare(normalizeSort(b), undefined, { numeric: true }))
}

async function ensureCleanTarget(dir) {
  await fs.mkdir(dir, { recursive: true })
  const entries = await fs.readdir(dir, { withFileTypes: true })
  await Promise.all(entries.map((entry) => fs.rm(path.join(dir, entry.name), { recursive: true, force: true })))
}

const raw = await fs.readFile(dataPath, 'utf8')
const projects = JSON.parse(raw)

for (const item of folderMap) {
  const sourceDir = path.join(downloadsBase, item.sourceFolder)
  const actualSourceDir = await resolveActualSourceDir(sourceDir)
  const targetDir = path.join(targetBase, item.targetFolder)
  const sourceFiles = await listImageFiles(sourceDir)

  await ensureCleanTarget(targetDir)

  for (const file of sourceFiles) {
    await fs.copyFile(path.join(actualSourceDir, file), path.join(targetDir, file))
  }

  const project = projects.find((entry) => entry.slug === item.slug)
  if (project) {
    project.images = sourceFiles.map((file) => `/2026/projects/${item.targetFolder}/${file}`)
  }
}

await fs.writeFile(dataPath, JSON.stringify(projects, null, 2), 'utf8')

for (const item of folderMap) {
  const project = projects.find((entry) => entry.slug === item.slug)
  console.log(`${item.slug}: ${project?.images?.length ?? 0}`)
}
