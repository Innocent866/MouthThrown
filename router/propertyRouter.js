const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router();
const { createproperty, singleproperty, allproperty, deleteProperty, updateProperty, getHouseProperties } = require('../controller/propertyControl');


// register route

router.post('/create', auth, createproperty);
// getAllProperty route
router.get('/getallproperty', allproperty);
// single product
router.get('/:propertyId',singleproperty)
// deleteProperty route
router.delete('/delete/:propertyId',auth,  deleteProperty);
// deleteProperty route
router.put('/update/:propertyId',auth,  updateProperty);
// houseProperty Route
router.get('/house', getHouseProperties)


module.exports = router;