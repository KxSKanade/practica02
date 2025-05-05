const express = require('express');
require('dotenv').config();
const methodOverride = require('method-override');

// Crear instancia de la aplicación
const app = express();

// Configurar middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Para soportar métodos PUT y DELETE
app.use('/uploads', express.static('public/uploads')); // Carpeta estática para archivos

// Importar routers
const clientesRouter = require('./routes/clientes');
const ordenesRouter = require('./routes/ordenes');

// Validar que los routers sean funciones antes de usarlos
if (typeof clientesRouter === 'function') {
  app.use('/api/clientes', clientesRouter);
} else {
  console.error('Error: clientesRouter no es una función válida.');
}

if (typeof ordenesRouter === 'function') {
  app.use('/api/ordenes', ordenesRouter);
} else {
  console.error('Error: ordenesRouter no es una función válida.');
}

// Ruta de prueba para validar el servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente.');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
