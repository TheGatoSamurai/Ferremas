// app.js
// Archivo principal de la aplicación Node.js

require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Importa la configuración de la base de datos
const productRoutes = require('./routes/productRoutes'); // Importa las rutas de productos
const contactRoutes = require('./routes/contactRoutes'); // Importa las rutas de contacto

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON en las solicitudes
app.use(bodyParser.json());

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
// Esto es necesario para que las vistas HTML puedan hacer solicitudes a esta API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite solicitudes desde cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos HTTP permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeceras permitidas
    next();
});

// Conectar a la base de datos al iniciar la aplicación
db.connectDb();

// Rutas de la API
app.use('/api', productRoutes); // Prefijo /api para las rutas de productos
app.use('/api', contactRoutes); // Prefijo /api para las rutas de contacto

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Ferremas funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de Ferremas API escuchando en el puerto ${PORT}`);
    console.log('Rutas disponibles:');
    console.log(`- GET /api/products (Obtener todos los productos)`);
    console.log(`- GET /api/products/:id (Obtener un producto por ID con historial de precios)`);
    console.log(`- POST /api/contact (Enviar un formulario de contacto)`);
});