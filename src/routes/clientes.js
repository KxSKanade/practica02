// Al inicio del archivo:
const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

// Ruta lista:
router.get('/', async (req, res) => {
  const [clientes] = await pool.query('SELECT * FROM Clientes');
  res.render('clientes/index', { clientes });
});

// Formulario nuevo:
router.get('/new', (req, res) => {
  res.render('clientes/form', { title: 'Nuevo Cliente', action: '/clientes' });
});

// Formulario editar:
router.get('/:id/edit', async (req, res) => {
  const [[cliente]] = await pool.query('SELECT * FROM Clientes WHERE id = ?', [req.params.id]);
  res.render('clientes/form', { title: 'Editar Cliente', action: `/clientes/${cliente.id}?_method=PUT`, cliente });
});