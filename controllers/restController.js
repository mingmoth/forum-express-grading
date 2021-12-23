const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({include: Category}).then(restaurants => {
      const data = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description.length > 50 ? restaurant.dataValues.description.substring(0, 50) + '...' : restaurant.dataValues.description,
        categoryName: restaurant.Category.name
      }))
      return res.render('restaurants', {restaurants: data})
    })
  }
}

module.exports = restController