import fs from 'fs'
import path from 'path'

export default async (file) => {
  const data = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
  return JSON.parse(data)
}