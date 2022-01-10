const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port:process.env.DATABASE_PORT
});

exports.register = (req, res) => {
    const { name, email, password, rePassword } = req.body;

    db.query('SELECT email FROM user WHERE email LIKE ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'email already in use'
            })
        } else if (password !== rePassword) {
            return res.render("register", {
                message: "passwords don't match"
            });
        }

        let hashedPass = await bcrypt.hash(password, 8);

        db.query('INSERT INTO user Set ?', { name: name, email: email, password: hashedPass }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                return res.render("register", {
                    message: "user registerd"
                });
            }
        });
    });

    //res.send("Form submitted");
}

exports.login = (req, res) => {
    const { email, password } = req.body;
    //console.log("in login func");
    if(email == 'admin' && password =='admin'){
        db.query(' SELECT * FROM car ', (error, results)=>{
            if(error){
                console.log(error);
            }else{
                return res.render("storeAdmin", {
                    cars: results 
                });
            }
        });
    }else{

        db.query('Select email,password From user WHERE email LIKE ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
            }

            //console.log(hashedPass);
            //console.log(results[0].password);

            if (results.length == 0) {
                console.log('no results')
                return res.render('login', {
                    message: 'email not registered'
                });

            } else {
                bcrypt.compare(password, results[0].password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    if (results) {
                        req.session.email =  email;    
                            db.query('SELECT * FROM car WHERE status = "available" ', (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    return res.render("store", {
                                        cars: results
                                    });
                                }
                            });
                        
                    } else {
                        return res.render('login', {
                            message: 'Invalid Credentials'
                        });
                    }
                });
            }

        })
    }
}