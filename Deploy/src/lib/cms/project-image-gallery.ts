import fs from 'node:fs'
import path from 'node:path'

const projectImageFolders: Record<string, string> = {
  'summer-house-comporta': 'summer_house_comporta',
  'contemporary-city-house': 'contemporary_city_house',
  'elegant-timeless-duplex': 'elegant_and_timeless_duplex',
  'beach-house-troia': 'beach_house_troia',
  'pombaline-restoration-principe-real': 'principe_real_pombaline_restoration',
  'rural-retreat': 'rural_retreat',
  'store-restauration-atelier': 'store_and_restauration_atelier',
}

const imageExtensionPattern = /\.(avif|gif|jpe?g|png|webp)$/i
const imageNameCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
const preferredExtensions = ['.webp', '.avif', '.jpg', '.jpeg', '.png', '.gif'] as const

function toPublicImagePath(folderName: string, fileName: string) {
  return `/2026/projects/${folderName}/${fileName}`
}

function getNormalizedBaseName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '')
}

function getExtensionPriority(fileName: string) {
  const extension = path.extname(fileName).toLowerCase()
  const priority = preferredExtensions.indexOf(extension as (typeof preferredExtensions)[number])
  return priority === -1 ? preferredExtensions.length : priority
}

export function getProjectImageGallery(slug: string, fallbackImages: string[] = []) {
  const folderName = projectImageFolders[slug]

  if (!folderName) {
    return fallbackImages
  }

  const projectDirectory = path.join(process.cwd(), 'public', '2026', 'projects', folderName)

  if (!fs.existsSync(projectDirectory)) {
    return fallbackImages
  }

  const images = fs
    .readdirSync(projectDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && imageExtensionPattern.test(entry.name))
    .map((entry) => entry.name)
    .reduce<Map<string, string>>((deduped, fileName) => {
      const baseName = getNormalizedBaseName(fileName)
      const current = deduped.get(baseName)

      if (!current || getExtensionPriority(fileName) < getExtensionPriority(current)) {
        deduped.set(baseName, fileName)
      }

      return deduped
    }, new Map())

  const uniqueImages = Array.from(images.values())
    .sort((left, right) => imageNameCollator.compare(left, right))
    .map((fileName) => toPublicImagePath(folderName, fileName))

  return uniqueImages.length > 0 ? uniqueImages : fallbackImages
}
