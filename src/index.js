// src/index.js
const express = require('express');
require('dotenv').config();
const app = express();

// 1. Middlewares globales
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// 2. Importar routers
const clientesRouter = require('./routes/clientes');
const ordenesRouter  = require('./routes/ordenes');

// 3. Usar routers
app.use('/api/clientes', clientesRouter);
app.use('/api/ordenes',  ordenesRouter);

// 4. Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));