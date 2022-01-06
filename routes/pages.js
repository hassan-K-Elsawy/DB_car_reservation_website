const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render('index');
});

router.get("/register", (req, res) =>{
    res.render('register')
});

router.get("/Login", (req, res) =>{
    res.render('login') // TODO implement login.hbs 
})

module.exports = router;