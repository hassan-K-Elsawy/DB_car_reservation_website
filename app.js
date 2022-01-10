const express      = require('express');
const mysql        = require('mysql');
const dotenv       = require('dotenv');
const path         = require('path');
const session      = require('express-session')
const redis        = require('redis');
const connectRedis = require('connect-redis');
const router       = express.Router();

dotenv.config({path:'./.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
//    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port:  process.env.DATABASE_PORT
});

const publicDirectory = path.join(__dirname , './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended : false}));
app.use(express.json());

app.set('view engine','hbs');

db.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log("MYSQL Connected ...");
    }
});

app.set('trust proxy', 1);
const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    resave: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}));

app.use('/', require('./routes/pages.js'));
app.use('/auth', require('./routes/auth'));


app.listen(5000, () => {
    console.log("Server started on port 5000")
});