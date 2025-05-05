import { Pool, PoolClient, QueryResult } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'soportetickets',
  password: 'Gta7613205',
  port: 5432,
})

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text, duration, rows: res.rowCount })
  return res
}

export const getClient = async () => {
  const client = await pool.connect()
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
