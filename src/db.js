const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render generalmente requiere SSL
  },
});

module.exports = pool; // Asegúrate de exportar el objeto `pool`
