

const isSighnedIn = require('./middleware/is-signed-in');
const passUserToView = require('./middleware/pass-user-to-view');


const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');


const usersController = require('./controllers/users');
const foodsRouter = require('./controllers/foods');
const user = require('./models/user.js');

const usersRouter = require('./routes/users');


const port = process.env.PORT ? process.env.PORT : '3000';

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

mongoose.connect(process.env.MONGODB_URI);


mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSighnedIn);



app.use('/foods', foodsRouter);

app.use('/users/:userId/foods', foodsController);


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/auth', authController);
app.use('users/:userId/foods', foodsController);

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
