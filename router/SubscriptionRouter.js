const express = require('express');
const auth = require('../middleware/auth');
const { createPayment, getPayment, subscription } = require('../controller/SubscribtionControl');
const router = express.Router();

router.post('/initialize-payment',createPayment)
router.get('/verify-payment/:reference',getPayment)
router.post('/userSubscription',subscription)

module.exports = router;