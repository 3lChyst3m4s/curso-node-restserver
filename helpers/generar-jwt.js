const jwt = require("jsonwebtoken");

//Esta funcion generarJWT() debe ser una promesa, esta recibe como argumento el id de user
const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = {uid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err) {
                console.log(err)
                reject('No se pudo generar el token')
            } else {
                resolve(token);
            }
        })
    })
}

module.exports = {
    generarJWT
}