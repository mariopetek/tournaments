import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

export default {
    query: async (SQL: string) => {
        try {
            const res = await pool.query(SQL)
            console.log('Executed query: ', {
                SQL,
                rows: res.rowCount
            })
            return res
        } catch (error) {
            console.log(error)
        }
    }
}
