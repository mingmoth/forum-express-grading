const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    const cateQuery = {}
    let categoryId = ''
    if(req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      cateQuery.CategoryId = categoryId
    }
    return Restaurant.findAll({include: Category, where: cateQuery}).then(restaurants => {
      const data = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description.length > 50 ? restaurant.dataValues.description.substring(0, 50) + '...' : restaurant.dataValues.description,
        categoryName: restaurant.Category.name
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', { restaurants: data, categories: categories, categoryId: categoryId })  
      })
      
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