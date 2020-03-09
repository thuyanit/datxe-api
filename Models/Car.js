const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
    brand: { //Nhãn hiệu
        type: String
    },
    model: { // Kiểu mẫu
        type: String
    },
    manufacturingYear: { //Năm sản xuất
        type: String
    },
    licensePlate: { //biển số xe
        type: String
    },
    numberOfSeats: { //Số ghế
        type: Number
    },
    carImage: { //Hình ảnh xe
        type: String
    }
})

CarSchema.methods.toJSON = function(){
    let car = this.toObject();
    return car;
}

const Car = mongoose.model("Car", CarSchema);

module.exports = {Car, CarSchema};