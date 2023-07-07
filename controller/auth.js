const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) => {
    const {correo, password} = req.body;
    try {
        //Verificar si email existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Verificar si el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado falso'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password falso'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })
    } catch(error) {
        console.log(error)

        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }
}

const googleSignIn = async(req, res = response) => {
    const {id_token} = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);
        let usuario = await Usuario.findOne({correo}); //Busca si existe el correo en la bd

        if(!usuario) {
            //Crear el usuario pues no existe
            const data = {
                nombre,
                correo,
                password: ':P',
                rol: 'USER_ROLE',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if(!usuario.estado) {
            //Usuario bloqueado en google
            return res.status(400).json({
                msg: 'Hable con el Administrador. Usuario bloqueado'
            });
        }

        //Generar el json web token
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch(error) {
        json.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}