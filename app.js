const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

//// Middleware
app.use(express.static('public')); // so you can access /public folder
app.use(express.json());
app.use(cookieParser());

//// view engine
app.set('view engine', 'ejs');

//// Database connection & start server
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then((result) => app.listen(PORT, () => console.log("Listening to port " + PORT)))
.catch((err) => console.log(err));

//// Routes

// Auth routes
/* 
routes   | method   | desc.                       
---------|----------|-----------------------------
/signup  | GET      | render sign up page
/login   | GET      | render login page          
/signup  | POST     | create new "user" in db          
/login   | POST     | authenticate a current user          
/logout  | GET      | log a user out          
*/

app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

app.use(authRoutes);