// src/routes/clientes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    const clientes = result[0]; // Accede a las filas

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
  const { nombre, correo} = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, correo) VALUES (?, ?)',
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
    const [cliente] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
    res.render('clientes/edit', { title: 'Editar Cliente', cliente: cliente[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos del cliente.');
  }
});

// Actualizar un cliente
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, } = req.body;
  try {
    await pool.query(
      'UPDATE clientes SET nombre = ?, correo = ? WHERE id = ?',
      [nombre, correo, id]
    );
    res.redirect('/api/clientes');  // Redirige a la lista de clientes
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el cliente.');
  }
});
// Eliminar un cliente
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el id del cliente desde los parámetros de la URL
  try {
    await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
    res.redirect('/api/clientes');  // Redirigir a la lista de clientes después de eliminar
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el cliente.');
  }
});

module.exports = router;
