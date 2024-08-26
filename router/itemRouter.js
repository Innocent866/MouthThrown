const express = require("express")
const { createProduct, getAllProducts, getProductById, getProductsByCategory, updateProduct, deleteProduct } = require("../controller/itemControl")
const router = express.Router()

router.post("/createProduct", createProduct)
router.get("/getallproducts", getAllProducts)
router.get("/getproductbyid/:id", getProductById)
router.get("/getproductsbycategory/:category", getProductsByCategory)
router.put("/updateproduct/:id", updateProduct)
router.delete("/deleteproduct/:id", deleteProduct)

module.exports = router;