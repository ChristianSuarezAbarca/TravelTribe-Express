const mongoose = require('mongoose');

let travelSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, minlength: 4, maxlength: 30 },
    description: { type: String, required: true, minlength: 20, maxlength: 400 },
    maxPeople: { type: Number, required: true, min: 0 },
    minAge: { type: Number, required: true, min: 0 },
    temperature: { type: String, required: true },
    images: [{ type: String, required: true }],
    likes: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0, max: 5},
    difficulty: { type: String },
    category: { type: String, required: true },
    keywords: [{ type: String }],
    activities: [{ type: String }],
    location: {
        country: { type: String},
        city: { type: String},
        coordinates: {
            lat: {type: Number},
            lng: {type: Number}
        }
    },
    price: {
        adultPrice: { type: Number, required: true, min: 0},
        childPrice: { type: Number, min: 0},
        finalPrice: { type: Number, min: 0} //Precio calculado tras poner la cantidad de personas y fecha y multiplicado por los precios anteriores
    },
    date: { //En los q no son aventura se seleccionara y en base a eso se calcula el precio
        startDate: { type: Date},
        endDate: { type: Date}
    },
    numberOfPersons:{ //En los q no son aventura se seleccionara y en base a eso se calcula el precio
        adults: { type: Number, min: 0},
        childs: { type: Number, min: 0},
    },
    logistics: {
        transport: { type: String, required: true},
        hotel: { type: String, required: true}
    },
    include: {
        includes: [{ type: String}],
        notIncludes: [{ type: String}]
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},//Para poner el nombre y la foto
        text: { type: String, required: true},
        date: { type: Date, required: true}
    }]
});

let Travel = mongoose.model('travels', travelSchema);
module.exports = Travel;