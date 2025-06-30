// -----------------------------------------------------
// config/db.js
// Configuración de la conexión a la base de datos MySQL/MariaDB
// -----------------------------------------------------
const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_SERVER_HOST,
    port: process.env.DB_SERVER_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

async function connectDb() {
    try {
        pool = mysql.createPool(config);
        const connection = await pool.getConnection();
        connection.release();
        console.log('Conectado a la base de datos MySQL/MariaDB.');
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        console.error('Detalles del error:', err);
        process.exit(1);
    }
}

module.exports = {
    connectDb,
    getPool: () => pool
};
