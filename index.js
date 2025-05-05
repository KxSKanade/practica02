const express = require('express');
require('dotenv').config();
const methodOverride = require('method-override');
const path = require('path');
const clientesRouter = require('./src/routes/clientes');
const ordenesRouter = require('./src/routes/ordenes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));  // Para Bootstrap u otros archivos de node_modules
app.use(express.static(path.join(__dirname, '/src/public')));  // Para archivos estáticos

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rutas
app.use('/api/clientes', clientesRouter);
app.use('/api/ordenes', ordenesRouter);

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('home', { title: 'Inicio' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
