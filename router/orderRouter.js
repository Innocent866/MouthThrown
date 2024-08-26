const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// const isAdmin = require('../middleware/isAdmin')
const restrict = require('../middleware/isAdmin')
const {order, getOrders, getAllOrdersByUser} = require('../controller/orderControl')


// create
router.post('/create',auth, order )

router.get('/getallorder',auth, restrict('admin'), getOrders);

router.get('/singleorder/:userId',auth,getAllOrdersByUser)
module.exports = router;