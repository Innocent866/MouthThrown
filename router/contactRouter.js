const express = require('express');
const { contact } = require('../controller/contactControl');
const router = express.Router();

router.post('/', contact);

module.exports = router;
