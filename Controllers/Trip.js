const {Trip, createTripSchema, bookTripSchema} = require("../Models/Trip")

const createTrip = async (req,res) => {
    //1. Validate data từ client
    const validationResult = createTripSchema.validate(req.body);
    if(validationResult.error){
        return res
        .status(422)
        .send({ message: "Validation fail!", data: validateResult.error });
    }

    //2.Check depatureDate ( new Date(departureTime) < new Date() )
    if(new Date(req.body.departureTime)< new Date())
        return res.status(400).send();

    try{
 
        //3. Create new trip + save()
        const newTrip = await new Trip(req.body).save();

        //4. send back to client
        res.send(newTrip);
    }catch(err){
        res.status(500).send();
    }
}

//http://localhost:2222/trips?page=1&limit=10&departurePlace=HCM&arrivalPlace=PQ&departureTime=2020-01-07&seats=5
const getTrips = async (req, res) => {
    //can phan trang o backend
    //limit = 10  ( 10 trip /trang) va page = 1
    // Thoong thuong truyen param tren url /trips?page=1&limit=10
    const {
        page=1, 
        limit=4, 
        departurePlace, 
        arrivalPlace, 
        departureTime, 
        seats
    } = req.query; //lay params từ url

    const skipItem = (+page-1) *limit;   //+page để chuyển params string về số

    // console.log(page, limit);
    try{
        const fromDate = new Date(departureTime);
        const toDate = new Date(departureTime);
        toDate.setDate(toDate.getDate()+1);

        console.log(fromDate, toDate);

        const trips = await Trip.find({
            departurePlace, 
            arrivalPlace, 
            departureTime : {
                $gte: fromDate,
                $lt: toDate
            },
            seats: {$gte: +seats}
        }).skip(skipItem).limit(+limit); //skip(2).limit(2) = bỏ 2 đầu, lấy 2 item tiếp theo
        
        //res.send(trips); không cần thong bao 200
        res.status(200).send(trips); 
    }catch(err){
        console.log(err);
        res.status(500).send();
    }
}

const deleteTripById = async (req, res)  => {
    try{
        const tripId = req.params.id;
        console.log(tripId);
        const trip = await Trip.findByIdAndDelete(tripId);
        if(!trip) return res.status(404).send();
        
        res.status(200).send(trip);
    }catch(err){
        console.log(err);
        res.status(500).send();
    }
}

const bookTrip = async (req, res) =>{
    const validateResult = bookTripSchema.validate(req.body);
    if(validateResult.error) 
        return res
        .status(422)
        .send({message: "Validation fail!", data: validateResult.error});

    const {
        tripId, 
        locationGetIn, 
        locationGetOff, 
        bookingSeats, 
        note
    } = req.body;

    try{
        const existedTrip = await Trip.findById(tripId);

        if(!existedTrip)
            return res.status(400).send({message: "Trip not found."});

        if(bookingSeats > existedTrip.seats)
            return res.status(400).send({message: "Available seats are not enough."});

        let passengers = {
            userId: req.userId,
            locationGetIn,
            locationGetOff,
            bookingSeats,
            note
        }
        
        existedTrip.passengers.push(passengers);
        existedTrip.seats = existedTrip.seats-bookingSeats;

        await existedTrip.save();
        res.send(existedTrip);
    }catch(err){
        res.status(500).send(err);
    }
}

module.exports = {createTrip, getTrips, deleteTripById, bookTrip};