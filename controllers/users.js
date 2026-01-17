const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

const foodController = require('./foods');


async function index(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    res.render('foods/index', { foods: user.pantry });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
}

async function show(req, res) {
  try {
    const user = await User.findById(req.params.userId).populate('pantry');
    const pantryItem = user.pantry.id(req.params.pantryItemId);
    res.render('foods/show', { user, pantryItem });
  } catch (error) { console.log(error);
    res.redirect('/');
  }
}

router.get('/users/:userId/foods/:itemId/edit', foodController.edit);


router.put('/users/:userId/foods/:foodId', foodController.updateFood);



router.get('/userId/foods', index);
router.get('/userId/foods/:pantryItemId', show);

module.exports = router;