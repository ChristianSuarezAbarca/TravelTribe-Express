const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const auth = require(__dirname + '/../auth/auth.js');
const bcrypt = require("bcrypt");

const router = express.Router();
const saltRounds = 10;

router.get("/", async (req, res) => {
    try {
        const result = await User.find();

        if (result.length === 0) {
            return res.status(404).send({ error: "No se encontraron viajes" });
        }

        res.status(200).send({ travels: result });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

router.get('/find', auth.protegerRuta(["admin", "client"]), async (req, res) => {
    try {
        const surname = req.query.surname;

        if (!surname) {
            const patients = await Patient.find();
            return res.status(200).send({ result: patients });
        }

        const result = await Patient.find({
            surname: { $regex: surname, $options: 'i' }
        });

        if (result.length === 0) {
            return res.status(404).send({ error: "No se ha encontrado ningun travel con esos criterios" });
        }

        res.status(200).send({ result: result });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

router.get('/:id', auth.protegerRuta(["admin", "client"]), async (req, res) => {
    try {
        const userId = req.user.id;
        const patientId = req.params.id;

        if (req.user.rol === 'user' && userId !== patientId) {
            return res.status(403).send({ error: "Acceso no autorizado" });
        }

        const result = await Patient.findById(req.params.id)

        if (result)
            res.status(200).send({ result: result });
        else
            res.status(404).send({ error: "No se encontraron travel" });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

router.post('/', auth.protegerRuta(["admin", "client"]), async (req, res) => {
    try {
        let nuevoPatient = new Patient({
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber
        });

        const result = await nuevoPatient.save()
        res.status(201).send({ result: result });
    } catch (error) {
        res.status(400).send({ error: "Error interno del servidor" });
    }
});

router.put('/:id', auth.protegerRuta(["admin", "client"]), async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ error: "Error actualizando los datos del user" });
    }
    let result = '';

    try {
        switch (req.query.type) {
            case "normal":
                result = await User.findByIdAndUpdate(req.params.id, {
                    $set: {
                        name: req.body.name,
                        username: req.body.username,
                        email: req.body.email,
                        number: req.body.number,
                    }
                }, {
                    new: true,
                    runValidators: true
                });
                break;
            case "password":
                result = await User.findByIdAndUpdate(req.params.id, {
                    $set: {
                        password: await bcrypt.hash(req.body.password, saltRounds),
                    }
                }, {
                    new: true,
                    runValidators: true
                });
                break;
            case "avatar":

                break;
        }

        if (!result) {
            return res.status(400).send({ error: "Error actualizando los datos del user" });
        }

        res.status(200).send({ result: result });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).send({ error: "Error actualizando los datos del user" });
        }
        res.status(500).send({ error: error.message });
    }
});

router.delete('/:id', auth.protegerRuta(["admin", "client"]), async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send({ error: "El travel a eliminar no existe" });
    }

    try {
        const result = await Patient.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).send({ error: "El travel a eliminar no existe" });
        }

        res.status(200).send({ result: result });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

module.exports = router;