const { Pool } = require('pg')
const pool = new Pool()

export default {
    query: (text, params) => pool.query(text, params),
}