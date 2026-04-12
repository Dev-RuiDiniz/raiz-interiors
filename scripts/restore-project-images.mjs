import fs from 'node:fs/promises'
import path from 'node:path'

const projectRoot = path.resolve(process.cwd(), '..')
const dataPath = path.join(projectRoot, 'data', 'admin-projects.json')
const publicProjectsDir = path.join(process.cwd(), 'public', '2026', 'projects')

const slugToFolder = {
  'summer-house-comporta': 'summer_house_comporta',
  'contemporary-city-house': 'contemporary_city_house',
  'elegant-timeless-duplex': 'elegant_and_timeless_duplex',
  'beach-house-troia': 'beach_house_troia',
  'pombaline-restoration-principe-real': 'principe_real_pombaline_restoration',
  'rural-retreat': 'rural_retreat',
  'store-restauration-atelier': 'store_and_restauration_atelier',
}

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function normalizeForSort(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '_')
}

function choosePreferredFiles(files) {
  const byBase = new Map()

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!allowedExtensions.has(ext)) continue
    const base = file.slice(0, -ext.length)
    const current = byBase.get(base)
    const rank = ext === '.webp' ? 2 : 1
    if (!current || rank < current.rank) {
      byBase.set(base, { file, rank })
    }
  }

  return [...byBase.values()].map((entry) => entry.file)
}

async function readProjectImages(folderName) {
  const folderPath = path.join(publicProjectsDir, folderName)
  const entries = await fs.readdir(folderPath, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)

  return choosePreferredFiles(files)
    .sort((a, b) => normalizeForSort(a).localeCompare(normalizeForSort(b), undefined, { numeric: true }))
    .map((file) => `/2026/projects/${folderName}/${file}`)
}

const raw = await fs.readFile(dataPath, 'utf8')
const projects = JSON.parse(raw)

const updated = await Promise.all(
  projects.map(async (project) => {
    const folderName = slugToFolder[project.slug]
    if (!folderName) return project

    try {
      const images = await readProjectImages(folderName)
      return {
        ...project,
        images,
      }
    } catch {
      return project
    }
  })
)

await fs.writeFile(dataPath, JSON.stringify(updated, null, 2), 'utf8')

const summary = updated
  .filter((project) => slugToFolder[project.slug])
  .map((project) => `${project.slug}: ${project.images.length}`)
  .join('\n')

console.log(summary)
