const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {
    //const {q, nombre = 'no envia', apikey} = req.query;
    const {limite = 5, desde = 0} = req.query; //Indicamos que vamos a recibir un parametro: limite, con valor por defecto 5

    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query), //Retorna total
        Usuario.find(query) //Retorna a los usuarios
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    /* 
    //Encuentra desde al limite registros de la DB
    const usuarios = await Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite)); //Encuentra todos los registros de la DB

    const total = await Usuario.countDocuments(query);
    */

    res.json({
        total,
        usuarios
    });
}
const usuariosPut = async(req, res = response) => {
    const {id} = req.params; //params puede traer muchos datos

    //Excluyo password, google y correo (no se actualizan) y todo lo demas lo almaceno en resto
    const {_id, password, google, correo, ...resto} = req.body;

    //POR HACER validar id contra la DB
    if(password) {
        //Encriptar la contraseña en caso que venga en el body
        const salt = bcryptjs.genSaltSync(); //Cantidad de vueltas que hará la encriptación por def. 10
        resto.password = bcryptjs.hashSync(password); //Encripta el password
    }

    //Actualiza el registro: Lo busca por id y actualiza con los valores de resto
    const usuario = await Usuario.findOneAndUpdate({ _id: id }, resto);

    res.json({
        usuario
    });
}
const usuariosPost = async(req, res = response) => {
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); //Cantidad de vueltas que hará la encriptación por def. 10
    usuario.password = bcryptjs.hashSync(password); //Encripta el password    
    
    await usuario.save(); //Esto es para grabar en BD

    res.json({
        usuario
    });
}
const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;

    //Borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id)
    //Borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json({
        usuario
    });
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

//Se exporta un objeto pues van a haber muchos
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}