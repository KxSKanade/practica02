// src/routes/ordenes.js
const express = require('express');
const upload = require('../middlewares/upload');
const { body, validationResult } = require('express-validator');
const pool = require('../db');
const router = express.Router();

/**
 * GET /api/ordenes
 * Listar todas las órdenes con datos de cliente
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.fecha, o.total, o.imagen,
              c.id AS cliente_id, c.nombre AS cliente_nombre, c.correo AS cliente_correo
       FROM Ordenes o
       JOIN Clientes c ON o.cliente_id = c.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

/**
 * POST /api/ordenes
 * Crear una orden (con imagen)
 */
router.post(
  '/',
  upload.single('imagen'),
  [
    body('fecha').isDate().withMessage('Fecha inválida'),
    body('total').isFloat({ gt: 0 }).withMessage('Total debe ser mayor a 0'),
    body('cliente_id').isInt().withMessage('Cliente inválido')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { fecha, total, cliente_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    try {
      const [result] = await pool.query(
        'INSERT INTO Ordenes (fecha, total, cliente_id, imagen) VALUES (?, ?, ?, ?)',
        [fecha, total, cliente_id, imagen]
      );
      res.status(201).json({ id: result.insertId, fecha, total, cliente_id, imagen });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear orden' });
    }
  }
);

/**
 * PUT /api/ordenes/:id
 * Editar una orden (posible nueva imagen)
 */
router.put(
  '/:id',
  upload.single('imagen'),
  [
    body('fecha').optional().isDate(),
    body('total').optional().isFloat({ gt: 0 }),
    body('cliente_id').optional().isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) data.imagen = req.file.filename;

    try {
      await pool.query('UPDATE Ordenes SET ? WHERE id = ?', [data, id]);
      res.json({ message: 'Orden actualizada' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar orden' });
    }
  }
);

/**
 * DELETE /api/ordenes/:id
 * Eliminar una orden
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Ordenes WHERE id = ?', [id]);
    res.json({ message: 'Orden eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar orden' });
  }
});

// Exporta el router para usar en src/index.js
module.exports = router;