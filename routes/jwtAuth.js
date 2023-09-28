const router = require("express").Router();
const client = require("../db/client");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const { createUsers, getUser } = require('../db/users')

const isAuth = (req, res, next) =>{
  const bearerHeader = req.headers['authorization'];

  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');

    const bearerToken = bearer[1];

    req.token = bearerToken;

    next();
  } else{
    res.send("your are not autheticated.")
  }
  
  }

// POST /api/users/register
router.post("/register", async (req, res) => {
    try {
        // destructure the req.body (name, email, password)

        const { username, email, password, firstName, lastName } = req.body;

        // check if user exist (if user exist then throw error)
        const userf = await client.query("SELECT * FROM users WHERE email = $1",
            [email]);

        if (userf.rows.length !== 0) {
            return res.status(401).send("user already exists");
        }

        const user = await createUsers({ username, email, password, firstName, lastName });

        // gereate our jwt token
        const token = jwtGenerator(user);
        req.user = user;
        res.send({ user, token });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

// login route

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        next({
          name: 'MissingCredentialsError',
          message: 'Please supply both a username and password'
        });
      }

    try {        

        const user = await getUser({ email, password });
        if(!user) {
            next({
              name: 'IncorrectCredentialsError',
              message: 'Username or password is incorrect',
            })
          } else {
            const token = jwtGenerator(user);
            res.send({ user, message: "you're logged in!", token });
          }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
})


router.get('/me', isAuth, (req, res)=>{
  res.send("you have enter a private route. ")


})




module.exports = router;