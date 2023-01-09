const express=require('express');
const multer=require('multer');
const router=express.Router();
const ArticuloControl=require('../controllers/articulo');

//ruta de almacenamiento de multer
const storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'./imagenes/articulos');
    },

    filename:function (req,file,cb){
        cb(null,"articulo"+Date.now()+file.originalname);
    }
});
const subidas=multer({storage:storage});



//rutas
router.get('/prueba',ArticuloControl.prueba);

router.post("/crearArticulo",ArticuloControl.crearArticulo);
router.get("/obtenerArticulos/:ultimos?",ArticuloControl.conseguirArticulo);
router.get("/obtenerArticulo/:id",ArticuloControl.unArticulo);
router.delete("/borrarArticulo/:id",ArticuloControl.borrarArticulo);
router.put("/editarArticulo/:id",ArticuloControl.editar);
router.post("/subirImagen/:id",subidas.single("imagen"),ArticuloControl.subir);
router.get("/imagen/:fichero",ArticuloControl.imagen);
router.get("/buscar/:palabra",ArticuloControl.buscar);



module.exports=router;