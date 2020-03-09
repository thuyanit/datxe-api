const bcrypt = require("bcryptjs");


//json web token package
const jwt = require("jsonwebtoken");

const {Car} = require("../Models/Cars");
const { User, createUserSchema, updateUserSchema } = require("../Models/User");

const createCar = () => {
    return async (req, res) => {
        const userId = req.userId;

        //1. lấy data từ client gửi lên
        const { brand, model, manufacturingYear, licensePlate, numberOfSeats, carImage } = req.body;
    
        try {
            //2.create đối tượng car mới từ data client gửi lên và lưu xuống db
            const car = new Car({
                brand,
                model, 
                manufacturingYear, 
                licensePlate, 
                numberOfSeats, 
                carImage
            });
            
            const user = await User.findByIdAndUpdate({_id: userId}, {cars: car}, {new: true});


            if (!user) return res.status(404).send();

            res.status(200).send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

const getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).send(cars);
    } catch (e) {console.log(e);
        res.status(500).send();
    }
};

const getCarByID = async (req, res) => {
    try {
        const carId = req.params.id;
        const car = await Car.findById(carId);

        if (!car) return res.status(404).send();

        res.status(200).send(car);
    } catch (e) {
        res.status(500).send();
    }
};

const deleteCarByID = async (req, res) => {
    try {
        const carId = req.params.id;
        const car = await car.findByIdAndDelete(carId);

        if (!car) return res.status(404).send();

        res.status(200).send(car);
    } catch (e) {
        res.status(500).send();
    }
};

const updateCarByID = async (req, res) => {
    try {
        const carId = req.params.id;

        const updateFields = Object.keys(req.body);
        const allowedUpdateFields = ["brand", "model","manufacturingYear","licensePlate", "numberOfSeats", "carImage"];

        const canUpdate = updateFields.every(item =>
            allowedUpdateFields.includes(item)
        );

        if (!canUpdate)
            return res
                .status(400)
                .send({ message: "Some fields are not allowed to update!" });

        const car = await Car.findByIdAndUpdate(carId, req.body, {
            new: true
        });

        if (!car) return res.status(404).send();

        res.status(200).send(car);
    } catch (e) {
        res.status(500).send(e);
    }
};

module.exports = {
    createCar,
    getCars,
    getCarByID,
    deleteCarByID,
    updateCarByID
}