const express= require('express');
const conectarDB = require('./config/db')
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar base de datos
conectarDB();

//Puerto de la app
const port = process.env.PORT  || 4000;

//Habiliatar leer valores del body
app.use(express.json());

//habilitar cors
const opciones = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(opciones));

//Habilitar la carpeta pública
app.use(express.static('uploads'));

//Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));

app.use('/api/archivos', require('./routes/archivos'));

app.listen(port, '0.0.0.0', ()=>{
    console.log(`El servidor está funcionando en el purto ${port}`);
})