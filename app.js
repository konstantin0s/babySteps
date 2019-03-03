const express      = require('express');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const path         = require('path');
const bodyParser   = require('body-parser');
const cors = require('cors');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cookieParser = require('cookie-parser');


const app = express();


const Parent = require("./models/parent");


mongoose
  .connect('mongodb://localhost/babysteps', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({  //setup sessions always here 
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
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


  const index = require('./routes/index');
  app.use('/', index);
  const authRouter = require('./routes/auth');
  app.use('/', authRouter);

  app.get('/', function(req, res){
    res.cookie('name', 'name'); //Sets name = express
    res.render('index');
  });
  
    //add session


  app.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route ---
    } else {                          //    |
      res.redirect("/login");         //    |
    }                                 //    |
  }); 

  const babySitters = require('./routes/babysitters');
  app.use('/', babySitters);
    const parent = require('./routes/parent');
  app.use('/', parent);
  const babysitter = require('./routes/babysitter');
  app.use('/', babysitter);
  
  // const addRecipe = require('./routes/addRecipe');
  // app.use('/', addRecipe);
  // const edit = require('./routes/edit');
  // app.use('/', edit);
  // const deleteRecipe = require('./routes/delete');
  // app.use('/', deleteRecipe);

  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });


  //close mongodb
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });
  
  module.exports = app;