const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../db');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/** Crear orden */
router.post('/', auth, upload.single('imagen'), [
  body('fecha').isDate(),
  body('total').isFloat({ gt: 0 }),
  body('cliente_id').isInt()
], async (req, res) => {
  // validación...
  const { fecha, total, cliente_id } = req.body;
  const imagen = req.file?.filename || null;
  const [result] = await pool.query(
    'INSERT INTO Ordenes (fecha, total, cliente_id, imagen) VALUES (?, ?, ?, ?)',
    [fecha, total, cliente_id, imagen]
  );
  res.json({ id: result.insertId, fecha, total, cliente_id, imagen });
});

/** Listar con cliente asociado */
router.get('/', auth, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT o.*, c.nombre AS cliente_nombre, c.correo AS cliente_correo
    FROM Ordenes o
    JOIN Clientes c ON o.cliente_id = c.id
  `);
  res.json(rows);
});

/** Obtener 1 */
router.get('/:id', auth, async (req, res) => {
  const [[orden]] = await pool.query(`
    SELECT o.*, c.nombre AS cliente_nombre FROM Ordenes o
    JOIN Clientes c ON o.cliente_id = c.id
    WHERE o.id = ?
  `, [req.params.id]);
  res.json(orden || {});
});

/** Editar orden */
router.put('/:id', auth, upload.single('imagen'), [
  body('fecha').optional().isDate(),
  body('total').optional().isFloat({ gt: 0 }),
  body('cliente_id').optional().isInt()
], async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.imagen = req.file.filename;
  await pool.query('UPDATE Ordenes SET ? WHERE id = ?', [data, req.params.id]);
  res.json({ msg: 'Orden actualizada' });
});

/** Eliminar */
router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM Ordenes WHERE id = ?', [req.params.id]);
  res.json({ msg: 'Orden eliminada' });
});

module.exports = router;
