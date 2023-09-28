const router = require('express').Router();
const client = require('../db/client');

router.post("/add-to-cart", async (req, res) => {
    const { userId, price, product_id, qty } = req.body;

    client.query(`SELECT cart_id FROM cart WHERE user_id = $1 AND status = $2`,
        [userId, 'open'],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Unable to check for open order' });
            } else {
                if (result.rows.length === 1) {
                    const orderId = result.rows[0].cart_id;
                    console.log("has a cart orderId is: ", orderId);

                    // Insert the line item into the line_items table
                    client.query(`INSERT INTO item(qty, price, cart_id, product_id) VALUES($1, $2, $3, $4) RETURNING *`, [qty, price, orderId, product_id],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({
                                    error: 'Unable to add itme to cart'
                                });
                            } else {
                                res.status(200).json({
                                    message: 'Item added to cart succesfully'
                                });
                            }
                        })
                } else {
                    // User doesn't have an open order, create a new order for them 
                    client.query(`INSERT INTO cart(user_id, status) VALUES ($1, $2) RETURNING *`, [userId, 'open'],
                        (err, result) => {
                            if (err) {
                                console.log(err)
                                res.status(500).json({ error: 'Unable to create a new order' });
                            } else {
                                const orderId = result.rows[0].cart_id;
                                console.log("do not have a orderId is: ", orderId);
                                // insert the line item inot the items table
                                client.query(`INSERT INTO item(qty, price, cart_id, product_id) VALUES($1, $2, $3, $4) RETURNING *`, [qty, price, orderId, product_id],
                                    (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).json({
                                                error: 'Unable to add itme to cart'
                                            });
                                        } else {
                                            res.status(200).json({
                                                message: 'Item added to cart succesfully'
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    )
                }
            }
        })
});


router.get('/view-cart/:userid', (req, res) => {
    const userId = req.params.userid;

    // Retrive the user's cart contents from the database
    client.query(`SELECT * FROM item WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1 AND status = $2)`, [userId, 'open'],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    error: 'Unable to fetch cart contents'
                });
            } else {
                // send the cart contents to the client
                res.status(200).json(result.rows);
            }
        })
})


router.post('/update-cart', (req, res)=>{
    // 
    const {orderId, product_id, qty} = req.body;

    // Update the quantity of the item in the cart
    client.query(`UPDATE item SET qty = $1 WHERE item_id = $2 
    AND cart_id = $3`, [qty, product_id, orderId], 
    (err, result)=>{
        if(err){
            console.log(err);
            res.status(500).json({error: "Unable to update cart"});
        } else{
            res.status(200).json({message: "Cart updated successfully"});
        }
    })
})

module.exports = router;