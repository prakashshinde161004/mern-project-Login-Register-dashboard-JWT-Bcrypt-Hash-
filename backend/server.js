const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = "mysecretekey";

let users = [];
app.post("/register", async(req, res) =>{
const {name, email, password} = req.body;

const exist = users.find( u => u.email === email);
if(exist) return res.json({message:"user alredy exists"});

const hash = await bcrypt.hash(password,10);
const user = {
id:Date.now(),
name,
email,
password:hash
};

users.push(user);
res.json({message:"registed successfull"});

});
//login

app.post("/login", async(req,res)=>{
const {email, password} = req.body;

const user = users.find( u => u.email === email);
if( !user) return res.json({message:" user not found"});

const token  = jwt.sign({id: user.id}, SECRET, {expiresIn: "1h"} );
res.json({message: " login success ", token});

});
//auth
const auth = (req,res,next) =>{
const token = req.headers["authorization"];
if(!token) return res.json({message:"no token"});
try{
   const decoded = jwt.verify(token, SECRET);
   req.user = decoded;
   next();
}
catch{
res.json({message:" invalid token"});
}
}

//DASHBOARD
app.get("/dashboard", auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ message: "Welcome", user });
});


app.listen(5000, (req,res)=>{
console.log("server is running")
})
