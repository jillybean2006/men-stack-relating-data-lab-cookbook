

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');




router.get('/', async function(req, res) {
    const user = await User.findById(req.user._id);
    res.render('foods/index', { foods: user.pantry });
});

router.get('/new', function(req, res) {
    res.render('foods/new');
});

router.get('/', (req, res) => {
  res.render('foods/index.ejs');
});



router.post('/', async function(req, res) {
    const user = await User.findById(req.user._id);
    user.pantry.push(req.body);
    await user.save();
    res.redirect('/foods');
});

router.get('/users/:userId/foods/new', (req, res) => {
  res.render('foods/new', { userId: req.params.userId });
});



router.post('/users/:userId/foods', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.pantry.push(req.body);
    await user.save();

    res.locals.user = user;
    res.locals.pantry = user.pantry;

    res.render('foods/index');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }     
});

const foodController = require('../controllers/foods.js');

router.delete('/:id', deleteFood);



 function deleteFood(req, res) {
  Food.findByIdAndDelete(req.params.id)
  res.redirect('/foods');
}

async function index(req, res) {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('foods/index', { foods: user.pantry });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
}

async function show(req, res) {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.itemId);
    res.render('foods/show', { user, food });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
}



async function edit(req, res) {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.itemId);
    res.render('foods/edit', { user, food });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
}


async function updateFood(req, res) {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.foodId);
    food.name = req.body.name;
    food.quantity = req.body.quantity;
    await user.save();
    res.redirect('/users/' + req.params.userId + '/foods');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
}

async function create(req, res) {
  try {
    await Food.create(req.body);
    res.redirect('/foods');
  } catch (error) {
    console.log(error);
    res.redirect('/foods/new');
  }
}


    

module.exports = {
  index, show, create, deleteFood, edit, updateFood 
}
