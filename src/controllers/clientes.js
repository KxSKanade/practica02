const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../db');
const auth = require('../middlewares/auth');

/** Crear cliente */
router.post('/', auth, [
  body('nombre').notEmpty(),
  body('correo').isEmail()
], async (req, res) => {
  // validación...
  const { nombre, correo } = req.body;
  const [result] = await pool.query(
    'INSERT INTO Clientes (nombre, correo) VALUES (?, ?)',
    [nombre, correo]
  );
  res.json({ id: result.insertId, nombre, correo });
});

/** Listar todos */
router.get('/', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Clientes');
  res.json(rows);
});

/** Obtener 1 */
router.get('/:id', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Clientes WHERE id = ?', [req.params.id]);
  res.json(rows[0] || {});
});

/** Editar */
router.put('/:id', auth, [
  body('nombre').optional().notEmpty(),
  body('correo').optional().isEmail()
], async (req, res) => {
  // validación...
  await pool.query('UPDATE Clientes SET ? WHERE id = ?', [req.body, req.params.id]);
  res.json({ msg: 'Actualizado' });
});

/** Eliminar */
router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM Clientes WHERE id = ?', [req.params.id]);
  res.json({ msg: 'Eliminado' });
});

module.exports = router;
