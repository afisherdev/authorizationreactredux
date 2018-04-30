//===Package  Requirements===
const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const http = require('http');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const path = require('path');
const bodyParser = require('body-parser');
const validator = require('express-validator')
require('./models/User');
require('./services/passport');
require('./services/mailer');

//=======Connect Mongo=======
// mongoose.connect(keys.mongoURI);
mongoose.connect('mongodb://localhost/auth');

//========Declaring App======
const app = express();

//=========Cookies===========
app.use(
  cookieSession({
    maxAge: 10 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

//=========Passport==========
app.use(passport.initialize());
app.use(passport.session());

//========Body Parser========
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
//==========Routing==========
require('./routes/authRoutes')(app);
require('./routes/router')(app);

//========Static Path========
app.use(express.static(path.join(__dirname, 'public')));

//===========DEV PORT========
const PORT = process.env.PORT || 5000;
app.listen(PORT);
//Server Setup
const port = process.env.PORT || 3090
const server = http.createServer(app);
server.listen(port);
