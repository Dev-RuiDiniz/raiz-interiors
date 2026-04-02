import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const publicRoot = path.join(projectRoot, 'public')
const textRoots = [
  path.join(projectRoot, 'src'),
  path.join(projectRoot, 'scripts'),
  path.join(projectRoot, 'prisma'),
]
const rootFiles = [
  path.join(projectRoot, 'app.js'),
  path.join(projectRoot, 'fix-project-assets.js'),
  path.join(projectRoot, 'next.config.ts'),
]
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])
const pathMap = new Map()
const dirMap = new Map()

function normalizeSegment(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['`]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

function normalizeFileName(fileName) {
  const extension = path.extname(fileName).toLowerCase()
  const baseName = path.basename(fileName, path.extname(fileName))
  const normalizedBaseName = normalizeSegment(baseName) || 'asset'
  return `${normalizedBaseName}${extension}`
}

function normalizeDirectoryName(dirName) {
  return normalizeSegment(dirName) || 'folder'
}

function getUniqueTarget(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return targetPath
  }

  const directory = path.dirname(targetPath)
  const extension = path.extname(targetPath)
  const baseName = path.basename(targetPath, extension)
  let counter = 2

  while (true) {
    const nextCandidate = path.join(directory, `${baseName}_${counter}${extension}`)
    if (!fs.existsSync(nextCandidate)) {
      return nextCandidate
    }
    counter += 1
  }
}

function toPublicUrl(absolutePath) {
  const relativePath = path.relative(publicRoot, absolutePath).split(path.sep).join('/')
  return `/${relativePath}`
}

function renameDirectoryIfNeeded(directoryPath) {
  if (directoryPath === publicRoot) {
    return directoryPath
  }

  const currentName = path.basename(directoryPath)
  const normalizedName = normalizeDirectoryName(currentName)

  if (normalizedName === currentName) {
    return directoryPath
  }

  const targetPath = getUniqueTarget(path.join(path.dirname(directoryPath), normalizedName))
  fs.renameSync(directoryPath, targetPath)
  dirMap.set(toPublicUrl(directoryPath) + '/', toPublicUrl(targetPath) + '/')
  return targetPath
}

function renameFileIfNeeded(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  if (!imageExtensions.has(extension)) {
    return filePath
  }

  const currentName = path.basename(filePath)
  const normalizedName = normalizeFileName(currentName)

  if (normalizedName === currentName) {
    return filePath
  }

  const targetPath = getUniqueTarget(path.join(path.dirname(filePath), normalizedName))
  fs.renameSync(filePath, targetPath)
  pathMap.set(toPublicUrl(filePath), toPublicUrl(targetPath))
  return targetPath
}

function walkAndNormalize(directoryPath) {
  const normalizedDirectoryPath = renameDirectoryIfNeeded(directoryPath)
  const entries = fs.readdirSync(normalizedDirectoryPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(normalizedDirectoryPath, entry.name)
    if (entry.isDirectory()) {
      walkAndNormalize(entryPath)
      continue
    }

    renameFileIfNeeded(entryPath)
  }
}

function listTextFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return []
  }

  const results = []
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name)
    if (entry.isDirectory()) {
      results.push(...listTextFiles(entryPath))
      continue
    }

    if (/\.(css|js|json|jsx|md|mjs|prisma|ts|tsx)$/.test(entry.name)) {
      results.push(entryPath)
    }
  }

  return results
}

function rewriteTextReferences() {
  const replacements = [...dirMap.entries(), ...pathMap.entries()].sort((left, right) => right[0].length - left[0].length)
  const files = [...textRoots.flatMap(listTextFiles), ...rootFiles.filter((filePath) => fs.existsSync(filePath))]

  for (const filePath of files) {
    const original = fs.readFileSync(filePath, 'utf8')
    let updated = original

    for (const [from, to] of replacements) {
      updated = updated.split(from).join(to)
    }

    if (updated !== original) {
      fs.writeFileSync(filePath, updated)
    }
  }
}

function writeMaps() {
  const outputDirectory = path.join(projectRoot, 'tmp')
  fs.mkdirSync(outputDirectory, { recursive: true })
  fs.writeFileSync(
    path.join(outputDirectory, 'asset-path-map.json'),
    JSON.stringify(
      {
        directories: Object.fromEntries([...dirMap.entries()].sort((left, right) => left[0].localeCompare(right[0]))),
        files: Object.fromEntries([...pathMap.entries()].sort((left, right) => left[0].localeCompare(right[0]))),
      },
      null,
      2
    )
  )
}

walkAndNormalize(publicRoot)
rewriteTextReferences()
writeMaps()

console.log(`Normalized ${dirMap.size} directories and ${pathMap.size} files.`)
