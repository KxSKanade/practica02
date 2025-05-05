// scripts/init-db.js
const pool = require('../src/db');

async function init() {
  try {
    // Ejecuta los CREATE TABLE si no existen
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Ordenes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        cliente_id INT NOT NULL,
        imagen VARCHAR(255),
        FOREIGN KEY (cliente_id) REFERENCES Clientes(id) ON DELETE CASCADE
      );
    `);

    console.log('Tablas inicializadas correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
  }
}

init();