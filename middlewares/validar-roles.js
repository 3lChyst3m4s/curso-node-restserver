const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
    if(!res.usuario) {
        return res.status(500).json({
            msg: 'Se quiere validar el Rol, sin validar token primero'
        });
    }

    const {rol, nombre} = res.usuario;
    if(rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es Administrador - No esta autorizado`
        });
    }

    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {
        if(!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere validar el Rol, sin validar token primero'
            });
        }

        //Ojo: en roles están ingresando los roles admitidos(admin ventas)
        if(!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El sistema requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}