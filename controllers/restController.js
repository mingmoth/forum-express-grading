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
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: Category}).then(restaurant => {
      return res.render('restaurant', {restaurant: restaurant.toJSON()})
      // const data = ({
      //   ...restaurant.dataValues,
      //   categoryName: restaurant.dataValues.Category.name
      // })
      // return res.render('restaurant', {restaurant: data})
    })
  }
}

module.exports = restController