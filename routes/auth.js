const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../auth/auth");
const jwt = require('jsonwebtoken');

const router = express.Router();
const saltRounds = 10;

router.post("/login", async (req, res) => {
	try {
		const { usernameOrEmail, password } = req.body;

		const existeUsuarioUsername = await User.findOne({
			username: usernameOrEmail,
		});
		const existeUsuarioEmail = await User.findOne({ email: usernameOrEmail });

		if (!existeUsuarioUsername && !existeUsuarioEmail) {
			return res.status(401).send({ error: "login incorrecto" });
		}

		const passwordCorrecta = existeUsuarioUsername
			? await bcrypt.compare(password, existeUsuarioUsername.password)
			: await bcrypt.compare(password, existeUsuarioEmail.password);

		if (!passwordCorrecta) {
			return res.status(401).send({ error: "login incorrecto" });
		}

		const token = existeUsuarioUsername
			? auth.generarToken(
				existeUsuarioUsername.username,
				existeUsuarioUsername.rol,
				existeUsuarioUsername._id
			)
			: auth.generarToken(
				existeUsuarioEmail.username,
				existeUsuarioEmail.rol,
				existeUsuarioEmail._id
			);

		res.status(200).send({ accessToken: token });
	} catch (error) {
		res.status(401).send({ error: "login incorrecto" });
	}
});

router.post("/register", async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

		const nuevoUser = new User({
			name: req.body.name,
			username: req.body.username,
			email: req.body.email,
			number: req.body.number,
			password: hashedPassword,
			rol: "client",
		});

		const result = await nuevoUser.save();
		res.status(201).send({ result: result });
	} catch (error) {
		res.status(400).send({ error: "register incorrecto" });
	}
});

router.post('/validate', (req, res) => {
	const { token } = req.body;

	if (!token) {
		return res.status(400).json({ error: 'Token no proporcionado' });
	}

	try {
		const resultado = jwt.verify(token, process.env.SECRETO);
		return res.status(200).json({ result: true });
	} catch (error) {
		return res.status(400).json({ error: 'Token inválido o expirado' });
	}
});

module.exports = router;
