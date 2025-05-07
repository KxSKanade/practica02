// src/routes/clientes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Asegúrate de tener la configuración de PostgreSQL aquí

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    const clientes = result.rows; // Cambié result[0] por result.rows, que es como PostgreSQL devuelve los datos

    if (!clientes || clientes.length === 0) {
      return res.render('clientes/index', { title: 'Clientes', clientes: [] });
    }

    res.render('clientes/index', { title: 'Clientes', clientes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los clientes.');
  }
});

// Mostrar el formulario para crear cliente
router.get('/new', (req, res) => {
  res.render('clientes/form', { title: 'Crear Cliente' });
});

// Crear un cliente
router.post('/', async (req, res) => {
  const { nombre, correo } = req.body;
  try {
    // Cambié la sintaxis para PostgreSQL con $1, $2, etc.
    const result = await pool.query(
      'INSERT INTO clientes (nombre, correo) VALUES ($1, $2) RETURNING *', // RETURNING * para obtener el cliente creado
      [nombre, correo]
    );
    res.redirect('/api/clientes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el cliente.');
  }
});

// Obtener los datos de un cliente para editar
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]); // $1 para el parámetro
    const cliente = result.rows[0]; // PostgreSQL devuelve los resultados en .rows
    res.render('clientes/edit', { title: 'Editar Cliente', cliente });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos del cliente.');
  }
});

// Actualizar un cliente
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;
  try {
    await pool.query(
      'UPDATE clientes SET nombre = $1, correo = $2 WHERE id = $3',
      [nombre, correo, id] // Usamos $1, $2 y $3 para los parámetros
    );
    res.redirect('/api/clientes'); // Redirige a la lista de clientes después de actualizar
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el cliente.');
  }
});

// Eliminar un cliente
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id del cliente desde los parámetros de la URL
  try {
    await pool.query('DELETE FROM clientes WHERE id = $1', [id]); // $1 para el parámetro
    res.redirect('/api/clientes'); // Redirige a la lista de clientes después de eliminar
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el cliente.');
  }
});

module.exports = router;
