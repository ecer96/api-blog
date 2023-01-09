const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../models/Articulos");
const path = require("path");
fs = require("fs");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy el metodo de Prueba",
    });
};

const crearArticulo = (req, res) => {
    //recoger datos a guardar
    let parametros = req.body;
    //validar datos
    try {
        validarArticulo(parametros);
    } catch (err) {
        return res.status(404).json({
            status: "Error",
            mensaje: "Faltan Datos Para Enviar",
        });
    }

    //crear objeto a guardar y pasamos un parametro para que se asignen los valores automaticamente
    const articulo = new Articulo(parametros);

    //guardar el articulo en la db
    articulo.save((err, articuloGuardado) => {
        if (err || !articuloGuardado) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No Se A Podido Guardar El Articulo",
            });
            //devolvemos los datos
        }
        return res.status(200).json({
            status: "Success",
            articulo: articuloGuardado,
        });
    });
};

const conseguirArticulo = (req, res) => {
    let consulta = Articulo.find({});

    if (req.params.ultimos) {
        consulta.limit(3);
    }

    consulta.sort({ fecha: -1 }).exec((err, articulos) => {
        if (err || !articulos) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No Se Han Encontrado Articulos!!",
            });
        }
        return res.status(200).json({
            status:'Success',
            items:articulos.length,
            articulos
        });
    });
};

const unArticulo = (req, res) => {
    //recoger por id
    let id = req.params.id;

    //buscar articulo
    Articulo.findById(id, (err, articulo) => {
        if (err || !articulo) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No Se Ha Encontrado El Articulo!!",
            });
        }
        return res.status(200).json({
            status: "Success",
            articulo,
        });
    });
};

const borrarArticulo = (req, res) => {
    let id = req.params.id;
    Articulo.findOneAndDelete({ _id: id }, (err, articuloBorrado) => {
        if (err || !articuloBorrado) {
            return res.status(404).json({
                status: "Error",
                message: "No Se Pudo Borrar El Articulo",
            });
        }
        return res.status(200).json({
            status: "Success",
            articuloBorrado,
        });
    });
};

const editar = (req, res) => {
    let id = req.params.id;
    //recoger datos a editar
    let parametros = req.body;

    try {
        validarArticulo(parametros);
    } catch (err) {
        return res.status(404).json({
            status: "Error",
            mensaje: "Faltan Datos Para Enviar",
        });
    }

    Articulo.findByIdAndUpdate(
        { _id: id },
        req.body,
        (err, articuloActualizado) => {
            if (err || !articuloActualizado) {
                return res.status(404).json({
                    status: "Error",
                    message:
                        "No Se Pudo Actualizar El Articulo Intente Nuevamente..",
                });
            }
            return res.status(200).json({
                status: "Success",
                articuloActualizado,
            });
        }
    );
};

const subir = (req, res) => {
    //configurar multer

    //recoger fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(200).json({
            status: "Error",
            message: "Peticion Invalida",
        });
    }

    //Nombre del archivo
    let nombreArchivo = req.file.originalname;

    //Extension del Archivo
    //separamos el nombre de la imagen de la extension
    let archivoSplit = nombreArchivo.split(".");

    //obtenemos solo la extension
    let extension = archivoSplit[1];

    //validamos extension

    if (
        extension != "png" &&
        extension != "jpg" &&
        extension != "jpeg" &&
        extension != "gif"
    ) {
        //borramos si no cumple con las extensiones
        fs.unlink(req.file.path, (error) => {
            return res.status(200).json({
                status: "Error",
                message: "Extension de la Imagen es Invalida",
            });
        });
    } else {
        let id = req.params.id;
        //recoger datos a editar

        Articulo.findByIdAndUpdate(
            { _id: id },
            { imagen: req.file.filename },
            { new: true },
            (err, articuloActualizado) => {
                if (err || !articuloActualizado) {
                    return res.status(404).json({
                        status: "Error",
                        message:
                            "No Se Pudo Actualizar El Articulo Intente Nuevamente..",
                    });
                }
                return res.status(200).json({
                    status: "Success",
                    articuloActualizado,
                    fichero: req.file,
                });
            }
        );
    }
};

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta = "./imagenes/articulos/" + fichero;

    fs.stat(ruta, (err, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta));
        } else {
            return res.status(404).json({
                status: "Error",
                message: "La Imagen No Existe",
            });
        }
    });
};

const buscar=(req,res)=>{
    let stringBuscar=req.params.palabra;

    Articulo.find({"$or":[
        {"titulo":{"$regex":stringBuscar,"$options":"i"}},
        {"titulo":{"$regex":stringBuscar,"$options":"i"}}
    ]}).sort({fecha:-1}).exec((err,articuloEncontrado)=>{
        
        if(err || !articuloEncontrado || articuloEncontrado<=0){
            return res.status(404).json({
                status:'Error',
                message:'No Se A Encontrado El Articulo'
            });
        }return res.status(200).json({
            status:'Success',
            articulo:articuloEncontrado
        });
    });

}

module.exports = {
    prueba,
    crearArticulo,
    conseguirArticulo,
    unArticulo,
    borrarArticulo,
    editar,
    subir,
    imagen,
    buscar,
};
