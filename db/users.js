const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;


// id SERIAL PRIMARY KEY,
// username varchar(50) NOT NULL,
// email VARCHAR(255) UNIQUE NOT NULL,
// password VARCHAR(255) NOT NULL,
// firstName VARCHAR(255) NOT NULL,
// lastName VARCHAR(255) NOT NULL 

async function createUsers({username, email, password, firstName, lastName}){
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    try {
        
        const {rows:[user]} = await client.query(`
        INSERT INTO users(username, email, password, firstName, lastName)
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING 
        RETURNING *`, [username, email, hashedPassword, firstName, lastName]);
        return user

    } catch (error) {
        console.log(error)
    }
}

async function getUser({email, password}){
    if(!email || !password) return;

    try {
        const user = await getUsername(email);
        if(!user) return;
        const hashedPassword = user.password; 
        const validPassword = await bcrypt.compare(password, hashedPassword);
        if(!validPassword) return;
        delete user.password;
        console.log("this is the rows", user);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUsername(email){
    try {
        const {rows} = await client.query(`
        SELECT * FROM users WHERE email = $1`, [email]);
        if(!rows || !rows.length) return null;

        const [user] = rows;        
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUsers,
    getUser,
    getUsername,
}