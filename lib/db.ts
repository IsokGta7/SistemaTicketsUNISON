import { Pool, PoolClient, QueryResult } from 'pg'

// Connection settings come from the environment (see .env.example). The
// password has no default: a missing DB_PASSWORD is a configuration error.
// The pool is created on first use so that next build, which loads every
// route module, does not need database credentials.
let pool: Pool | undefined

function getPool(): Pool {
  if (!pool) {
    const password = process.env.DB_PASSWORD
    if (!password) {
      throw new Error('DB_PASSWORD is not set')
    }
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'soportetickets',
      password,
      port: Number(process.env.DB_PORT) || 5432,
    })
  }
  return pool
}

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now()
  const res = await getPool().query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text, duration, rows: res.rowCount })
  return res
}

export const getClient = async () => {
  const client = await getPool().connect()
  const originalQuery = client.query
  const originalRelease = client.release

  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
  }, 5000)

  // Monkey patch the query method
  client.query = (...args: any[]) => {
    return originalQuery.apply(client, args)
  }

  client.release = () => {
    // Clear our timeout
    clearTimeout(timeout)
    // Set the methods back to their old un-monkey-patched version
    client.query = originalQuery
    client.release = originalRelease
    return originalRelease.apply(client)
  }

  return client
}

export default {
  query,
  getClient,
}
