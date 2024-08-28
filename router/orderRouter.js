const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// const isAdmin = require('../middleware/isAdmin')
const restrict = require('../middleware/isAdmin')
const {order, getOrders, getAllOrdersByUser, getOrderById} = require('../controller/orderControl')


// create
router.post('/create',auth, order )

router.get('/getallorder',auth, restrict('admin'), getOrders);

router.get('/single/:userId',auth,getAllOrdersByUser)
router.get('/singleorder/:userId',getOrderById)


module.exports = router;