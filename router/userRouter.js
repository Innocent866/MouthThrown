const express = require('express');
const { registration, login, getUserName, isLoggedIn, forgotPassword, resetPassword, getAllUser, deleteUser } = require('../controller/userControl');
const auth = require('../middleware/auth')
const router = express.Router();
const limiter = require('../middleware/loginAccountLimiter')


// register route
router.post('/registration',registration);
// login route
router.post('/login',limiter,login);
// getAllUser route
router.get('/getalluser', getAllUser);
// getUserName route
router.get('/getusername',auth,  getUserName);
// isLoggedIn route
router.get('/isloggedin',isLoggedIn);
// forgot password route
router.post('/forgotpassword', forgotPassword);
// reset password route
router.put('/resetpassword/:resetToken',resetPassword) 
// delete password route
router.delete("/deleteuser/:id", deleteUser)
module.exports = router;