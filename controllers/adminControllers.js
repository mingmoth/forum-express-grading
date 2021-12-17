const db = require('../models')
const Restaurant = db.Restaurant

const adminControllers = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({raw: true}).then(restaurants => {
      return res.render('admin/restaurants', {restaurants: restaurants})
    })
    
  }
}

module.exports = adminControllers