const mongoose = require("mongoose")

const Joi = require("joi");

const tripSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // lay tu bang user
    },
    departurePlace: String,
    arrivalPlace: String,
    departureTime: Date,
    seats: {
        type: Number,
        default: 1
    },
    fee: Number,
    passengers: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"  // lay tu bang user
            },
            locationGetIn:  String,
            locationGetOff: String,
            paymentStatus: {
                type: Boolean,
                default: false
            },
            bookingSeats: Number,
            notes:  String //yeu cau/ghi chu,
        }
    ]
},{
    timestamps: true //cap nhat thoi gian tao/update
})

const createTripSchema = Joi.object({
    driverId: Joi.string().required(),
    departurePlace: Joi.string().required(),
    arrivalPlace: Joi.string().required(),
    departureTime: Joi.date().required(),
    seats: Joi.number().required(),
    fee: Joi.number().required(),
    passengers: Joi.array().items(Joi.object({
        userId: Joi.string().required(),
        locationGetIn: Joi.string().required(),
        locationGetOff: Joi.string().required(),
        paymentStatus: Joi.boolean().required(),
        bookingSeats: Joi.number().required(),
        note: Joi.string()
    }))
})

const bookTripSchema = Joi.object({
    tripId: Joi.string().required(),
    locationGetIn: Joi.string().required(),
    locationGetOff: Joi.string().required(),
    bookingSeats: Joi.number().required(),
    note: Joi.string()
})

const Trip = mongoose.model("Trip", tripSchema);
module.exports = {Trip, createTripSchema, bookTripSchema};