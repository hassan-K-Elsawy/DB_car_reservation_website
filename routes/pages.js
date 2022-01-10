const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const { NEWDATE } = require("mysql/lib/protocol/constants/types");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});


router.get("/", (req, res) => {
    session  = req.session;
    if(session.email)
    router.get("/store", (req, res) => {
        db.query('SELECT * FROM car WHERE status = "available" ', (error, results)=>{
            if(error){
                console.log(error);
            }else{
                db.query(' SELECT * FROM car ', (error, results)=>{
                    if(error){
                        console.log(error);
                    }else{
                        return res.render("storeAdmin", {
                            cars: results 
                        });
                    }
                });
            }
        });
    });
    else
        return res.render('index');
});

router.post("/addCaradd", (req, res) =>{
    const {plateID, status, price, year, producer, model, color, millage, fuelType, noOfSeats, type} = req.body;
    db.query('INSERT INTO car Set ?', {plateID:plateID , status:status, rentVal:price, year:year, producer:producer, model:model, color:color, millageOnFullTank:millage, fuelType:fuelType, noOfSeats:noOfSeats, type:type},(error, results)=>{
        if(error){
            console.log(error);
        }else{
            db.query(' SELECT * FROM car ', (error, results)=>{
                if(error){
                    console.log(error);
                }else{
                    return res.render("storeAdmin", {
                        cars: results 
                    });
                }
            });
        }
    });
    return res.render('addCar')
});

router.get("/register", (req, res) => {
    res.render('register')
});

router.get("/Logout", (req, res) => {
    if (req.session)
        req.session.destroy();
    res.render('login');
});

router.get("/addCar", (req,res)=>{
    res.render('addCar');
});

router.post("/deleteRes", async(req, res)=>{
    const resID = req.body.resID;
    console.log(resID);
    db.query('DELETE FROM reservation WHERE reservationID = ?', [resID],  (erro,results)=>{
        if(erro){
            console.log(erro)
        }else{
            db.query(' SELECT * FROM car ', (error, results)=>{
                if(error){
                    console.log(error);
                }else{
                    return res.render("storeAdmin", {
                        cars: results 
                    });
                }
            });
        }
    });
});

router.post("/deleteCar", (req,res)=>{
    const carid = req.body.car;
    db.query('DELETE FROM car WHERE plateID = ?', [carid], (error)=>{
        if(error){
            console.log(error)
        }else{
            db.query(' SELECT * FROM car ', (error, results)=>{
                if(error){
                    console.log(error);
                }else{
                    return res.render("storeAdmin", {
                        cars: results 
                    });
                }
            });
        }
    });
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
            return res.render("cart", {
                car: results[0]
            });
        }
    })
});
/*
router.post("/reserve", (req, res) => {
    console.log('the customer has payed successfuly')
    const email = req.session.email;
    var { plateID, reserveDate, returnDate, price} = req.body;
    reserveDate = new Date(reserveDate);
    returnDate = new Date(returnDate);
    reserveDate.toISOString().slice(0, 11).replace('T', ' ');
    returnDate.toISOString().slice(0, 11).replace('T', ' ');

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
                //db.query('Update car SET status = "reserved" WHERE plateID = ?')

                    oldRes = oldResResult;
                    db.query('SELECT userID FROM user WHERE email LIKE ?',[email],(erroor,userID)=>{

                    // database call end.
        if (oldRes != null && oldRes[0] != null) {
            var reservedEndDate = new Date(oldRes[0].oldest);
            if (reservedEndDate.setHours(0,0,0,0) <= reserveDate.setHours(0,0,0,0)) {

                var reservingDays = returnDate.getTime() - reserveDate.getTime()
                reservingDays = reservingDays / (1000*60*60*24);
                price = reservingDays * price;

                
                //database call:
                db.query('INSERT INTO reservation (userID,plateID,recieveDate,returnDate,payment) VALUES (?,?,?,?,?)',
                        [userID, plateID, reserveDate.toISOString(), returnDate.toISOString(),price], 
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
            db.query('INSERT INTO reservation (userID,plateID,recieveDate,returnDate,payment) VALUES (?,?,?,?,?)',
                [userID, plateID, reserveDate.toISOString(), returnDate.toISOString(), price],
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

        })

        }
        });

    }

})*/

router.get("/reservations", (req, res) => {
    session  = req.session;
    db.query('SELECT userID FROM user WHERE email LIKE ?',[session.email],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            db.query('SELECT * FROM reservation r INNER JOIN user u ON r.userID = u.userID',[result[0]], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render("reservations", {
                    reservation: results
                });
            }
        });
    }});
});

router.get('/storeAdmin',(req, res)=>{
    db.query(' SELECT * FROM car ', (error, results)=>{
        if(error){
            console.log(error);
        }else{
            return res.render("storeAdmin", {
                cars: results 
            });
        }
    }); 
})

router.get("/reservationsAdmin", (req,res) =>{
    db.query('SELECT r.reservationID, u.name, c.plateID, c.producer, c.model, r.recieveDate, r.returnDate, r.payment  FROM user u INNER JOIN reservation r ON r.userID = u.userID INNER JOIN car c ON c.plateID = r.plateID', (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //console.log(results);
            return res.render("reservationsAdmin", {
                reservation: results 
            });
        }
    });
});

router.get('/cancel', (req,res)=>{
    const resID = req.body.resID;
    console.log(resID);
    db.query('DELETE FROM reservation WHERE reservationID = ?', [resID],  (erro,results)=>{
        if(erro){
            console.log(erro)
        }else{
            db.query(' SELECT * FROM car ', (error, results)=>{
                if(error){
                    console.log(error);
                }else{
                    return res.render("storeAdmin", {
                        cars: results 
                    });
                }
            });
        }
    });
})

router.post("/reserve",(req,res) => {
    session  = req.session;
    var {reserveDate , returnDate, plateID, rentVal} = req.body;
    reserveDate = new Date(reserveDate);
    returnDate = new Date(returnDate);
    var reservingDays = returnDate.getTime() - reserveDate.getTime()
    reservingDays = reservingDays / (1000*60*60*24);
    var price = reservingDays * rentVal;
    reserveDate.toISOString().slice(0, 11).replace('T', ' ');
    returnDate.toISOString().slice(0, 11).replace('T', ' ');

    const email = req.session.email;
    db.query('SELECT userID from user where email like ?',[session.email],(err,result)=>{
    db.query('Update car set status = "reserved" where plateID = ?',[plateID],(errors)=>{
    var userID = result[0].userID;

    db.query('INSERT INTO reservation Set ?', {plateID:plateID , userID : userID, recieveDate:reserveDate, returnDate:returnDate, payment:500},(error, results)=>{
        if(error){
            console.log(error);
        }else{
            db.query(' SELECT * FROM car Where status = "available" ', (error, results)=>{
                if(error){
                    console.log(error);
                }else{
                    return res.render("store", {
                        cars: results 
                    });
                }
            });
        }
    });
    })
})
})

router.post("/storeSpec",(req,res)=>{
    var {minPrice, maxPrice,minMile,maxMile} = req.body;
    if(!minPrice){
        minPrice = 0;
    }
    if(!maxPrice){
        maxPrice = 5000;
    }
    if(!minMile){
        minMile = 0;
    }
    if(!maxMile){
        maxMile = 5000;
    }
    db.query('SELECT * FROM car WHERE status = "available" AND rentVal >= ? AND rentVal <= ? AND millageOnFullTank >= ? AND millageOnFullTank <= ? ',[minPrice,maxPrice,minMile,maxMile], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            return res.render("store", {
                cars: results
            });
        }
    });
})

module.exports = router;