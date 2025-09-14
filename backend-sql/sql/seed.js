import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SEEDS_DIR = path.join(__dirname, 'seeds')

const SEED_ORDER = [
  'quankhu.seed.sql',
  'tinhthanh.seed.sql',
  'phuongxa.seed.sql',
  'capbac.seed.sql',
  'chucvu.seed.sql',
  'phongban.seed.sql',
  'donvi.seed.sql',
  // 'danhbalienhe.seed.sql',
  'nguoidung.seed.sql',
  'vaitroquyenhan.seed.sql',
  'quyentruycap.seed.sql',
]

async function runSeeds() {
  const client = await pool.connect()

  try {
    console.log('Inserting seed data...')

    // Run each seed file individually to avoid transaction issues
    for (const seedFile of SEED_ORDER) {
      const filePath = path.join(SEEDS_DIR, seedFile)
      console.log(`Processing seed file: ${seedFile}`)

      try {
        const sql = fs.readFileSync(filePath, 'utf8')
        await client.query(sql)
        console.log(`Successfully executed seed file: ${seedFile}`)
      } catch (error) {
        console.error(`Error executing seed file ${seedFile}:`, error.message)
        // Continue with other files instead of failing completely
        console.log(`Skipping ${seedFile} and continuing with other files...`)
      }
    }

    console.log('Seed files processing completed')
  } catch (error) {
    console.error('Error running seed files:', error)
    throw error
  } finally {
    client.release()
  }
}

// Function to clear all seed data (useful for testing/reset)
async function clearSeeds() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Clear data in reverse order to handle dependencies
    for (const seedFile of [...SEED_ORDER].reverse()) {
      const tableName = seedFile.split('.')[0]
      try {
        await client.query(`TRUNCATE TABLE ${tableName} CASCADE`)
        console.log(`Cleared data from table ${tableName}`)
      } catch (error) {
        console.error(`Error clearing table ${tableName}:`, error.message)
      }
    }

    await client.query('COMMIT')
    console.log('All seed data cleared successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error clearing seed data:', error)
    throw error
  } finally {
    client.release()
  }
}

export { runSeeds, clearSeeds }
