const { response, request } = require("express");
const jwt = require('jsonwebtoken');
const Usuario = require("../models/usuario");

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');
    
    if(!token) {
        return res.status(401).json({
            msg: 'No existe Token en la peticion'
        });
    }

    try {
        //Funcion que verifica la validez del token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        //Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        //Verificar si el usuario no existe o esta borrado
        if(!usuario) {
            return res.status(401).json({
                msg: 'El token no es valido - usuario borrado de la DB'
            })
        }

        //Verificar que el usuario tiene estado en true
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'El token no es valido - usuario con estado false'
            })
        }

        req.usuario = usuario;
        req.uid = uid;

        next();
    } catch(error) {
        console.log(error);

        res.status(401).json({
            msg: 'Token no Valido'
        })
    }
}

module.exports = {
    validarJWT
}