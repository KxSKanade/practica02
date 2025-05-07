const express = require('express');
const router = express.Router();
const pool = require('../db');  // Asegúrate de que 'db.js' maneja la conexión a la base de datos
const multer = require('multer');
const path = require('path');

// Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, '../public/images');
    console.log('Ruta de destino:', destinationPath);  // Asegúrate de que esta es la ruta correcta
    cb(null, destinationPath); // Guardar en public/images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname); // Nombre único para evitar colisiones
    console.log('Nombre del archivo:', file.fieldname + '-' + uniqueSuffix);  // Asegúrate de que el nombre sea correcto
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Filtro para asegurarse que solo imágenes sean aceptadas
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Solo se permiten imágenes');
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('imagen');

// Ruta para obtener las órdenes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT o.id, c.nombre AS cliente, o.producto, o.cantidad, o.total, o.imagen FROM ordenes o JOIN clientes c ON o.id_cliente = c.id'
    );
    const ordenes = result.rows;  // Accede a las filas de la consulta

    if (!ordenes || ordenes.length === 0) {
      return res.render('ordenes/index', { title: 'Órdenes', ordenes: [] });
    }

    res.render('ordenes/index', { title: 'Órdenes', ordenes });
  } catch (err) {
    console.error('Error al obtener órdenes: ', err);
    return res.status(500).send('Error al obtener órdenes');
  }
});

// Ruta para mostrar el formulario de nueva orden
router.get('/new', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes'); // Obtenemos todos los clientes
    res.render('ordenes/form', { clientes: result.rows, title: 'Crear Orden' });  // Renderiza la vista form.ejs
  } catch (err) {
    console.error('Error al obtener clientes: ', err);
    return res.status(500).send('Error al obtener clientes');
  }
});

// Ruta para insertar una nueva orden (con imagen)
router.post('/', upload, async (req, res) => {
  const { id_cliente, producto, cantidad, total } = req.body;
  const imagen = req.file ? '/images/' + req.file.filename : null; // Obtiene la ruta de la imagen (si existe)

  console.log('Datos recibidos:', req.body);
  console.log('Imagen guardada:', imagen);  // Verifica si la imagen se guarda correctamente

  // Asegurarse de que los datos sean correctos antes de insertar
  if (!id_cliente || !producto || !cantidad || !total) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    // Insertar la nueva orden con la imagen
    await pool.query(
      'INSERT INTO ordenes (id_cliente, producto, cantidad, total, imagen) VALUES ($1, $2, $3, $4, $5)',
      [id_cliente, producto, cantidad, total, imagen]
    );
    res.redirect('/api/ordenes'); // Redirige a la lista de órdenes
  } catch (err) {
    console.error('Error al insertar la orden: ', err);
    return res.status(500).send('Error al insertar la orden');
  }
});

// Ruta para obtener los datos de la orden y mostrar en un formulario para editar
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM ordenes WHERE id = $1', [id]);
    const clientes = await pool.query('SELECT * FROM clientes');
    res.render('ordenes/edit', { orden: result.rows[0], clientes: clientes.rows, title: 'Editar Orden' });
  } catch (err) {
    console.error('Error al obtener la orden: ', err);
    return res.status(500).send('Error al obtener la orden');
  }
});

// Ruta para actualizar la orden (con imagen)
router.post('/edit/:id', upload, async (req, res) => {
  const { id } = req.params;
  const { id_cliente, producto, cantidad, total } = req.body;
  const imagen = req.file ? '/images/' + req.file.filename : null;  // Si se sube una nueva imagen

  try {
    await pool.query(
      'UPDATE ordenes SET id_cliente = $1, producto = $2, cantidad = $3, total = $4, imagen = $5 WHERE id = $6',
      [id_cliente, producto, cantidad, total, imagen, id]
    );
    res.redirect('/api/ordenes');
  } catch (err) {
    console.error('Error al actualizar la orden: ', err);
    return res.status(500).send('Error al actualizar la orden');
  }
});

// Ruta para eliminar una orden
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM ordenes WHERE id = $1', [id]);
    res.redirect('/api/ordenes');
  } catch (err) {
    console.error('Error al eliminar la orden: ', err);
    return res.status(500).send('Error al eliminar la orden');
  }
});

module.exports = router;
