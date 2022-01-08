const express = require("express");
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get("/", (req, res) => {
    res.render('index');
});

router.get("/register", (req, res) =>{
    res.render('register')
});

router.get("/Login", (req, res) =>{
    res.render('login') 
})

router.get("/store", (req, res) => {
    db.query('SELECT * FROM car WHERE status = "available" ', (error, results)=>{
        if(error){
            console.log(error);
        }else{
            return res.render("store", {
                cars: results 
            });
        }
    });
});

router.post("/cart", (req, res) =>{
    const carid = req.body.car;
    db.query('SELECT * FROM car WHERE plateID = ?',[carid] ,(error, results) =>{
        if(error){
                console.log(error);
        }else{
            //console.log(results);
            res.render("cart", {
                car: results[0]
            });  
        }   
    })
});





module.exports = router;