import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

export default {
    query: async (sql: string) => {
        const result = await pool.query(sql)
        console.log('Executed query: ', {
            sql,
            rows: result.rowCount
        })
        return result
    }
}
