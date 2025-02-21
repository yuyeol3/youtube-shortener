const mysql = require('mysql2');
const env = process.env.DB_ENV || 'development';
const config = require(process.cwd() + '/config/config.json')[env];

const pool = mysql.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
}).promise();




module.exports = pool;
