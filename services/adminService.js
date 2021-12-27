const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminService = {
  // get all restaurants
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then(restaurant => {
      // 只需要處理「一筆資料」時，我們會建議用 .toJSON() 把 Sequelize 回傳的整包物件直接轉成 JSON 格式
      callback({ restaurant: restaurant.toJSON() })
    })
  },
  // get all Categories
  getCategories: (req, res, callback) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id).then((category) => {
          callback({ category: category.toJSON(), categories: categories })
        })
      } else {
        callback({ categories: categories })
      }
    })
  },
}

module.exports = adminService