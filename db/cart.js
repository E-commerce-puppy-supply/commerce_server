const client = require('./client');

async function addToCart(price,  cart_id, product_id, qty){

    const {row: [item]} = await client.query(`
        INSERT INTO item(qty, price, cart_id, product_id) VALUES ($1, $2, $3, $4)
    `, [qty, price, cart_id, product_id], (error, result)=>{
        if(error){
            console.log(error);
        } else {
            
        }
    });
    return item;
}

async function updateToCart(){

}

async function removeFromCart(){

}

module.exports 