const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 9
const helpers = require('../../_helpers')

const restService = require('../../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  getTopRestaurant: (req, res) => {
    restService.getTopRestaurant(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = restController