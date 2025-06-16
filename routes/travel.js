const express = require('express');
const mongoose = require('mongoose');
const Travel = require('../models/travel');
const auth = require(__dirname + '/../auth/auth.js');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await Travel.find();

        if (result.length === 0) {
            return res.status(404).send({ error: "No se encontraron viajes" });
        }

        res.status(200).send({ travels: result });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

router.get('/:id', auth.protegerRuta(["admin", "client"]), async (req, res) => {
    try {
        const result = await Travel.findById(req.params.id)

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
        let newTravel = new Travel({
            title: req.body.title,
            description: req.body.description,
            maxPeople: req.body.maxPeople,
            minAge: req.body.minAge,
            temperature: req.body.temperature,
            images: req.body.images,
            likes: req.body.likes,
            rate: req.body.rate,
            difficulty: req.body.difficulty,
            category: req.body.category,
            keywords: req.body.keywords,
            activities: req.body.activities,
            location: {
                country: req.body.location?.country,
                city: req.body.location?.city,
                coordinates: {
                    lat: req.body.location?.coordinates?.lat,
                    lng: req.body.location?.coordinates?.lng
                }
            },
            price: {
                adultPrice: req.body.price?.adultPrice,
                childPrice: req.body.price?.childPrice
            },
            date: {
                startDate: req.body.date?.startDate,
                endDate: req.body.date?.endDate
            },
            logistics: {
                transport: req.body.logistics?.transport,
                hotel: req.body.logistics?.hotel
            },
            include: {
                includes: req.body.include?.includes,
                notIncludes: req.body.include?.notIncludes
            }
        });

        const result = await newTravel.save()
        res.status(201).send({ result: result });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put('/addOrRemoveLike', auth.protegerRuta(["admin", "client"]), async (req, res) => {
    let result = '';

    try {
        if (req.body.likeOrUnlike === "like") {
            result = await Travel.findByIdAndUpdate(req.body.travel._id, {
                $set: {
                    likes: req.body.travel.likes + 1
                }
            }, {
                new: true,
                runValidators: true
            });
        }
        else {
            result = await Travel.findByIdAndUpdate(req.body.travel._id, {
                $set: {
                    likes: req.body.travel.likes - 1
                }
            }, {
                new: true,
                runValidators: true
            });
        }

        if (!result) {
            return res.status(400).send({ error: "Error actualizando los datos del travel" });
        }

        res.status(200).send({ likes: result.likes });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).send({ error: "Error actualizando los datos del travel" });
        }
        res.status(500).send({ error: error.message });
    }
});

router.delete('/:id', auth.protegerRuta(["admin", "client"]), async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send({ error: "El travel a eliminar no existe" });
    }

    try {
        const result = await Travel.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).send({ error: "El travel a eliminar no existe" });
        }

        res.status(200).send(result._id);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

module.exports = router;