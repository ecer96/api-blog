const {conexion}=require('./basedatos/conexion');
const express=require('express');
const app=express();
const cors=require('cors');
const port=process.env.PORT||3000;

//conectar a db
conexion();
//configurar cors
app.use(cors());
//convertir body a json
app.use(express.json()); //recibir datos con content-type json
app.use(express.urlencoded({extended:true}));// decodifica datos y los convierte a json

const rutas_articulo=require('./routes/articulo');

app.use('/api',rutas_articulo);


//servidor en el puerto Indicado
app.listen(port,()=>{
    console.log('Servidor Corriendo en El Puerto 3000');
});