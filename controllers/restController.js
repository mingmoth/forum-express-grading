const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 9
const helpers = require('../_helpers')

const restService = require('../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => {
      return res.render('restaurants', data)
    })
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => {
      return res.render('restaurant', data)
    })
  },
  getTopRestaurant: (req, res) => {
    restService.getTopRestaurant(req, res, (data) => {
      return res.render('topRestaurant', data)
    })
  },
  getDashBoard: (req, res) => {
    restService.getDashBoard(req, res, (data) => {
      return res.render('dashboard', data)
    })
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data => {
      return res.render('feeds', data)
    }))
    // return Promise.all([
    //   Restaurant.findAll({
    //     limit: 10,
    //     raw: true,
    //     nest: true,
    //     order: [['createdAt', 'DESC']],
    //     include: [Category]
    //   }),
    //   Comment.findAll({
    //     limit: 10,
    //     raw: true,
    //     nest: true,
    //     order: [['createdAt', 'DESC']],
    //     include: [User, Restaurant]
    //   })
    // ]).then(([restaurants, comments]) => {
    //   return res.render('feeds', {restaurants: restaurants, comments: comments})
    // })
  },
}

module.exports = restController