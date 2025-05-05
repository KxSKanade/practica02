// src/routes/clientes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db');
const router = express.Router();

/**
 * GET /api/clientes
 * Listar todos los clientes
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Clientes');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

/**
 * POST /api/clientes
 * Crear un nuevo cliente
 */
router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Debe ser un correo válido')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { nombre, correo } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO Clientes (nombre, correo) VALUES (?, ?)',
        [nombre, correo]
      );
      res.status(201).json({ id: result.insertId, nombre, correo });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  }
);

/**
 * PUT /api/clientes/:id
 * Editar un cliente existente
 */
router.put(
  '/:id',
  [
    body('nombre').optional().notEmpty(),
    body('correo').optional().isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const data = req.body;
    try {
      await pool.query('UPDATE Clientes SET ? WHERE id = ?', [data, id]);
      res.json({ message: 'Cliente actualizado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  }
);

/**
 * DELETE /api/clientes/:id
 * Eliminar un cliente
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Clientes WHERE id = ?', [id]);
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

// Exporta el router para usar en src/index.js
module.exports = router;