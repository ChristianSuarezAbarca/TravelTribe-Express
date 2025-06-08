const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const User = require("../models/user");
dotenv.config();

let generarToken = (username, rol, id) => {
    return jwt.sign({username: username, rol: rol, id: id}, process.env.SECRETO, {expiresIn: "2 hours"});
};

let validarToken = token => {
    try {
        let resultado = jwt.verify(token, process.env.SECRETO);
        return resultado;
    } catch (e) {}
}

let protegerRuta = (rolesPermitidos) => {
    return async (req, res, next) => {
        let token = req.headers['authorization'];

        if (token) {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            let resultado = validarToken(token);

            if (resultado && rolesPermitidos.includes(resultado.rol)) {
                const user = await User.findById(resultado.id).select('-password');
                if (!user) return res.status(404).send({ error: 'Usuario no encontrado' });
                req.user = user;
                next();
            } else {
                res.status(403).send({ error: "Acceso no autorizado" });
            }
        } else {
            res.status(403).send({ error: "Acceso no autorizado" });
        }
    };
};

    
module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegerRuta: protegerRuta
};