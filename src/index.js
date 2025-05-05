const express = require('express');
require('dotenv').config();
const app = express();
const clientesRoutes = require('./routes/clientes');
const ordenesRoutes  = require('./routes/ordenes');

app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

app.use('/api/clientes', clientesRoutes);
app.use('/api/ordenes',  ordenesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
