require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const client = require("./db/client");
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;


client.connect();

// middleware
app.use(cors())
app.use(express.json());

// register and login routes
app.use("/auth", require("./routes/jwtAuth"));

app.use("/shop",require("./routes/products"));

app.use("/cart", require("./routes/cart"));


app.listen(port, ()=>{console.log(`app is listening on port ${port}`)})