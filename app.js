const fallback = require('express-history-api-fallback');
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cookieParser = require('cookie-parser');
const flash = require('req-flash');

require("dotenv").config();
const app = express();

hbs.registerHelper('date', require('helper-date'));


mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('auth', path.join(__dirname, 'auth'));
app.set('view engine', 'hbs');
var root = __dirname + '/public'
app.use(express.static(root))
    // app.use(fallback('index.html', { root: root }))
    // app.use(express.static(path.join(__dirname, 'public')));
    // app.use(fallback({ root: root }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({ //setup sessions always here
    secret: "basic-auth-secret",
    key: 'sid',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 * 1000 // 1 day
    })
}));

//enables cors
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.locals.title = 'BabySteps';


app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth', {
    layout: false
}));
app.use('/', require('./routes/auth2', { layout: false }));

app.use(["/parent*", "/babysitter*.", "/parents*", "/babysitters*"], (req, res, next) => {
    var tries = 3;
    if (req.session.currentUser == undefined) {
        console.log('res local Current-user', req.session);
        tries -= 1;
        res.redirect("/");
    } else {
        console.log('res local Current-user', req.session.currentUser);
        next();
    }
    if (tries < 0) {
        res.redirect("/");
    }
});


app.use(flash());
app.use('/', require('./routes/editParent'));
app.use('/', require('./routes/editBabysitter'));
app.use('/', require('./routes/parent'));
app.use('/', require('./routes/parents'));
app.use('/', require('./routes/babysitters'));
app.use('/', require('./routes/babysitter'));


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port 5000...Happy Surfing`);
});


//close mongodb
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});

module.exports = app;