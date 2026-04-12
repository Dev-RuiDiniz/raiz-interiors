import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd(), '..')
const relativePath = path.join('2026', 'projects', 'contemporary_city_house', '18_contemporary minimalist microcement  detail interior design by RAIZ - Cópia.JPG')
const publicTargets = [
  path.join(repoRoot, 'public', relativePath),
  path.join(process.cwd(), 'public', relativePath),
]

const dataFiles = [
  path.join(repoRoot, 'data', 'admin-projects.json'),
  path.join(process.cwd(), 'data', 'admin-projects.json'),
]

const imageUrl = '/2026/projects/contemporary_city_house/18_contemporary minimalist microcement  detail interior design by RAIZ - Cópia.JPG'

for (const target of publicTargets) {
  await fs.rm(target, { force: true })
}

for (const file of dataFiles) {
  try {
    const raw = await fs.readFile(file, 'utf8')
    const projects = JSON.parse(raw)
    const updated = projects.map((project) =>
      project.slug === 'contemporary-city-house'
        ? { ...project, images: (project.images || []).filter((image) => image !== imageUrl) }
        : project
    )
    await fs.writeFile(file, JSON.stringify(updated, null, 2), 'utf8')
  } catch {}
}

console.log('duplicate removed')
