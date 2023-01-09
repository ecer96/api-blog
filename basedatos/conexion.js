const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const conexion = async () => {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");

        console.log("Conectado Correctamente A la Base de Datos");
    } catch (err) {
        console.log(error);
        throw new Error("No Se A Podido Conectar a La Base De Datos");
    }
};

module.exports = { conexion };
