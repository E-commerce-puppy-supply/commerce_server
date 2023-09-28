const client = require('./client');


// products functions

async function createProduct({ title, price, description, category, image, rating: { rate, count } }) {
    try {        
        const { rows: [product] } = await client.query(`
        INSERT INTO products(title, price, description, category, image, rate, qty)
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING product_id, title`, [title, price, description, category, image, rate, count]);
        return product;
    } catch (error) {
        console.log(error);
    }
}

async function getAllProducts() {
    try {
        const { rows } = await client.query(`
    SELECT * FROM products;`);
    return rows;
    } catch (error) {
        console.log(error);
    }

}

async function getProductbyId(id){
    try {
        const {rows: [product]} =await client.query(`
        SELECT * FROM products WHERE id = $1`, [id])
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    createProduct,
    getAllProducts,
    getProductbyId,
}