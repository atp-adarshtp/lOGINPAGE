const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express();
// convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}))
// use Ejs as the view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User

// Register User
app.post("/signup",async (req,res) => {
   const data={
    name: req.body.username,
    password: req.body.password
   }
//    check if the user aleready exists in the database
const existingUser = await collection.findOne({name: data.name});
if (existingUser) {
    res.send("User already exists. Please choose a different username.")
}else{
    // hash the password using bcrypt 
    const saltRounds = 10; //number of salt round for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds)

    data.password = hashedPassword; //Raplace the hash password with orignal password

    const userdata = await collection.insertMany(data);
    console.log(userdata);
}
  
});


// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("Username not found.");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                res.render("home");
            } else {
                res.send("Wrong password.");
            }
        }
    } catch (error) {
        console.error(error);
        res.send("Error occurred during login.");
    }
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});