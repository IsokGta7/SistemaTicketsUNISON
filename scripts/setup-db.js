const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const password = process.env.DB_PASSWORD
if (!password) {
  console.error('DB_PASSWORD is not set; export it (see .env.example) before running this script.')
  process.exit(1)
}
const user = process.env.DB_USER || 'postgres'
const host = process.env.DB_HOST || 'localhost'
const port = Number(process.env.DB_PORT) || 5432

const pool = new Pool({
  user,
  host,
  database: 'postgres', // Connect to default database first
  password,
  port,
})

async function setupDatabase() {
  const client = await pool.connect()
  try {
    // Create database if it doesn't exist
    await client.query(`
      SELECT 'CREATE DATABASE soportetickets'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'soportetickets')
    `)

    // Connect to the new database
    await client.end()
    const dbPool = new Pool({
      user,
      host,
      database: 'soportetickets',
      password,
      port,
    })

    const dbClient = await dbPool.connect()
    try {
      // Read and execute the SQL setup script
      const sqlScript = fs.readFileSync(path.join(__dirname, 'setup-db.sql'), 'utf8')
      await dbClient.query(sqlScript)
      console.log('Database setup completed successfully!')
    } finally {
      dbClient.release()
      await dbPool.end()
    }
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase() 