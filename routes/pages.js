const express = require("express");
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});


router.get("/", (req, res) => {
    session = req.session;
    if (session.email)
        res.render('store');
    else
        res.render('index');
});

router.get("/register", (req, res) => {
    res.render('register')
});

router.get("/Logout", (req, res) => {
    if (req.session)
        req.session.destroy();
    res.render('login');
});



router.get("/Login", (req, res) => {
    res.render('login')
});

router.get("/specs", (req, res) => {
    res.render('spec');
});

router.get("/store", (req, res) => {
    db.query('SELECT * FROM car WHERE status = "available" ', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            return res.render("store", {
                cars: results
            });
        }
    });
});

router.post("/cart", (req, res) => {
    const carid = req.body.car;
    db.query('SELECT * FROM car WHERE plateID = ?', [carid], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            //console.log(results);
            res.render("cart", {
                car: results[0]
            });
        }
    })
});

router.post("/reserve", (req, res) => {
    const email = req.session.email;
    var { plateID, reserveDate, returnDate } = req.body;
    reserveDate = new Date(reserveDate);
    returnDate = new Date(returnDate);

    if (returnDate.getTime() < reserveDate.getTime()) { //check if the reserve date is after the return date
        // database call:
        db.query('SELECT * FROM car WHERE plateID = ?', [plateID], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render("cart", {
                    car: results[0],
                    message: "Please enter a valid reservation date and return date"
                });
            }
        });
        // database call end


    } else { // we now need to check if the car is already reserved or we will reserve it directly
        var oldRes;
        // database call:
        db.query('SELECT MAX(returnDate) as oldest FROM reservation WHERE plateID = ?', [plateID],(error, oldResResult) => {
            console.log(oldResResult);
            if (error) {
                console.log(error);
            } else {

                    oldRes = oldResResult;

                    // database call end.
        if (oldRes != null && oldRes[0] != null) {
            var reservedEndDate = new Date(oldRes[0].oldest);
            console.log(reservedEndDate.getDate());
            console.log(reserveDate.getDate());
            if (reservedEndDate.getDate() < reserveDate.getDate()) {
                console.log("1");
                //database call:
                db.query('INSERT INTO reservation (userID,plateID,recieveDate,returnDate) VALUES (?,?,?,?)',
                        [req.session.userID, plateID, reserveDate.toISOString(), returnDate.toISOString()], 
                        (qerr2, results) => {
                                                if (qerr2) {
                                                    console.log(qerr2);
                                                }
                        }
                );
                //database call end.
                db.query('SELECT * FROM car WHERE status = "available" ', (error3, results) => {
                    if (error3) {
                        console.log(error3);
                    } else {
                        return res.render("store", {
                            cars: results
                        });
                    }
                });
            } 
            
            else {
                console.log("2");
                //database call:
                db.query('SELECT * FROM car WHERE plateID = ?', 
                    [plateID], 
                    (qerr, result) => {
                                        if (qerr) {
                                            console.log(qerr);
                                        } else {
                                            return res.render("cart", {
                                            car: result[0],
                                            message: "Car already Reserved"});
                                        }
                    }
                );
                //database call end.
            }


        } else {
            //database call:
            db.query('INSERT INTO reservation (userID,plateID,recieveDate,returnDate) VALUES (?,?,?,?)',
                [req.session.userID, plateID, reserveDate.toISOString(), returnDate.toISOString()],
                (qerr, results) => {
                                        if (qerr) {
                                            console.log(qerr);
                                        }
                }
            );
            //database call end
            db.query('SELECT * FROM car WHERE status = "available" ', (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.render("store", {
                        cars: results
                    });
                }
            });
        }



            }
        });

    }

})

router.get("/reservations", (req, res) => {
    db.query('SELECT * FROM reservation r INNER JOIN car c ON r.plateID = c.plateID', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            return res.render("reservations", {
                reservation: results
            });
        }
    });
});


module.exports = router;