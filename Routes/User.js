const express = require("express");

const passport = require("passport");

// const bcrypt = require("bcryptjs");

const userController = require("../Controllers/User");

const passportRef = require("../Passport/passport");

const {authenticate,  authorize} = require('../Middlewares/Auth');

//upload hình ảnh
const multer = require('multer');

//valid extension
// const uploadImages = multer({
//     //storage: //quy dinh hinh anh dc gui len se dc luu o vi tri nào
//     storage : multer.diskStorage({
//         destination: (req, file, cb)=>{
//           cb(null, 'images');
//         },
//         filename: (req, file, cb)=> {
//           cb(null, new Date().getTime()+"-"+file.originalname)
//         }
//     }),
//     fileFilter: (req, file, cb) =>{
        // if(file.originalname.match(/\.(png|jpg|jpeg|gif)$/)){
        //     cd(null,true);
        // }else{
        //     cb(new Error('File format is not supported!'));
        // }
//     }
// });
const uploadImages = multer({
    limits: 1000000,
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "images");
      },
      filename: (req, file, cb) => {
        if(file.originalname.match(/\.(png|jpg|jpeg|gif)$/)){
            cb(null, file.originalname);
        }else{
            cb(new Error('File format is not supported!'));
        }
      }
    }),
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  });
//chỗ này sẽ cần phải sữa lại cách import, tại vì bên kia ta export ra một object có 2 thuộc tính, dùng spread operator bóc ra sử dung
// const { User, createUserSchema, updateUserSchema } = require("../Models/User");

const router = express.Router();

//enpoint: /users POST

router.post("/", 
    //authenticate, //authenticate là một middleware tư tạo, truoc khi thao tac bắt buocj phải login mới có thể thực hiện được
    // authorize(['admin']), 
    userController.createUser()
);

//users GET
router.get("/", authenticate, userController.getUsers);

// /users/2345678
router.get("/:id", userController.getUserByID);

// /users/1234567 DELETE
router.delete("/:id", userController.deleteUserByID);

// /users/2348909876 PATCH {name: "dung", avatar: "456788789876"}
router.patch("/:id", userController.updateUserByID);

//endpoint: /users/signup
router.post("/signup", userController.createUser(true));

router.post("/login", userController.login);

router.post(
    "/auth/facebook", 
    passport.authenticate('AuthenticateWithFacebook', {session: false}),
    userController.authenticateWithFacebook
);

//reset password
router.post("/auth/reset-password", authenticate, userController.resetPassword);

//upload avatar
//uploadImages.single : mỗi lầm accept 1 file
router.post('/upload/avatar', authenticate, uploadImages.single('file'), userController.uploadAvatar);
module.exports = router;
