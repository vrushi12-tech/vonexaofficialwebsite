require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

const userRouter = require('./routes/userRouter');
const errorController = require('./controllers/errors');

const hostRouter = require('./routes/hostRouter');
const authRouter = require('./routes/authRoutes');
const mongoConnect = require('./utils/databaseUtils');

const app = express();
app.set('view engine','ejs',);
app.set('views','views')
app.use(express.static('public'));
app.use(express.urlencoded());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(authRouter);
app.use(userRouter);
app.use(hostRouter);


app.get('/demo', (req, res) => {
  res.redirect(301, '/');
});
app.use(errorController.error404);

const port = process.env.PORT || 2999; 
mongoConnect((client) => 
  {

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
} )
});
