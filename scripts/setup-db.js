const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Connect to default database first
  password: 'Gta7613205',
  port: 5432,
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
      user: 'postgres',
      host: 'localhost',
      database: 'soportetickets',
      password: 'Gta7613205',
      port: 5432,
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