const router = require('express').Router();
const { getAllProducts } = require('../db/products')


router.get("/products", async (req, res, next) => {    
    try {
        const products = await getAllProducts();
        if (products) {
            res.send(products);
        } else {
            next({
                name: 'NotFound',
                message: `No Routines found for Activity ${req.params.activityId}`
            })
        }
    } catch (error) {
        next(error);
    }
});

router.get("/products/:id", (req, res) => {

});

module.exports = router;