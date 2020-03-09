const jwt = require('jsonwebtoken');
const {User} = require('../Models/User');

//Check xem có tài khoản hay chưa
const authenticate = async (req, res, next) =>{
    //lay token từ header của request
    const tokenStr = req.get('Authorization');

    if(!tokenStr) return res.status(400).send({message: 'No token provider!'});

    // console.log(token);
    const token = tokenStr.split(' ')[1];
    //Kiểm tra token (email, expiresIn)

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken);

        //
        const existedUser = await User.findById(decodedToken.userId);
        if (!existedUser) return res.status(401).send({ message: "Permission deny!" });

        req.userId = existedUser._id;
        req.userEmail = existedUser.email;
        req.userRole = existedUser.role;

        next();

    } catch (err) {
        res.status(401).send({message: "Permission Deny!", data: err});
    }
}

//Check xem có quyền ????/
const authorize = accessRoles =>{
    return async (req, res, next) =>{
        let canAccess = false;
        req.userRole.forEach(item=>{
            if(accessRoles.includes(item)) {
                canAccess = true;
                next();
            }
        });

        if(!canAccess)
            return res.status(401).send( {message: "Permission Deny!" });
        
        
    };
}

module.exports = {
    authenticate,
    authorize
}