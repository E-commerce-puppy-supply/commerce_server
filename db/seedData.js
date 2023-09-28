const client = require('./client');
const {createProduct} = require('./products')



// const getProduct = async () => {
//     const response = await fetch('https://fakestoreapi.com/products');
//     const result = await response.json()
//     return result;
// }

// async function getDummyJsonProduct() {
//     const response = await fetch('https://dummyjson.com/products?limit=0');
//     const result = await response.json();
//     return result;
// }


async function dropTables() {

    console.log("Dropping All tables...");

    try {
        await client.query(`
        DROP TABLE IF EXISTS item;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS users;
        `)
    } catch (error) {
        throw error;
    }
}


async function createTables() {
    try {
        console.log("Creating All tables...");
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username varchar(50) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL 
        );`)
            
        await client.query(`
        CREATE TABLE cart(
            cart_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),    
            status VARCHAR(100)        
        );
        `)

        await client.query(`
        CREATE TABLE products(
            product_id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            price VARCHAR(50) NOT NULL, 
            category VARCHAR(50),
            description TEXT NOT NULL,
            image VARCHAR(100) NOT NULL,
            rate VARCHAR(50) NOT NULL,
            qty VARCHAR(50) NOT NULL
            
        );
        `)

        await client.query(`
        CREATE TABLE item(
            item_id SERIAL PRIMARY KEY,
            qty INTEGER NOT NULL, 
            price VARCHAR(100) NOT NULL,
            cart_id INTEGER REFERENCES cart(cart_id),
            product_id INTEGER REFERENCES products(product_id)
        );
        `)


        console.log("Creating All tables completed");

    } catch (error) {
        console.log(error)
    }
}
/*
Creating product: 
id: 
title:
price:
description:
category:
image:
rating: {rate: count}

From dummyjson
id: 
title:
description:
price
discountPercentage:
rating
stock
brand
category
thumbnail
images

*/



async function runProducts() {
    try {
        // Make multiple fetch requests concurrently using Promise.all
        const [fakeStoreResponse, dummyJSONResponse] = await Promise.all([
            fetch('https://fakestoreapi.com/products'),
            // fetch('https://dummyjson.com/products'),
        ]);

        

        // Parse the JSON responses
        const fakeStoreData = await fakeStoreResponse.json();
        // const dummyJSONData = await dummyJSONResponse.json();
        console.log("inserting data to tables")
        const products = await Promise.all(fakeStoreData.map(createProduct));
        console.log("Data was inserted.")
        // Combine data from both APIs
        // const combinedData = [...fakeStoreData, ...dummyJSONData.products];
        console.log(products);

    } catch (error) {
        console.log(error)
    };
}

async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await runProducts();
    } catch (error) {
        throw error;
    }
}

module.exports = {
    rebuildDB
}