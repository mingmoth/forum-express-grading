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
    return Restaurant.findByPk(req.params.id, { include: 
      [Category,
        // 這在資料庫的術語裡叫做 eager loading，是預先加載的意思
      {model: User, as: 'FavoritedUsers'},
      { model: User, as: 'LikedUsers' },
      {model: Comment, include: [User]}]
    }).then(async(restaurant) =>  {
      await restaurant.increment('viewCounts')
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id),
        isLiked: restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      })
      // const data = ({
      //   ...restaurant.dataValues,
      //   categoryName: restaurant.dataValues.Category.name
      // })
      // return res.render('restaurant', {restaurant: data})
    })
  },
  getTopRestaurant: (req, res) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers'}]
    }).then(restaurants => {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.description.length > 50 ? restaurant.description.substring(0, 50) + '...' : restaurant.description,
        favoritedCount: restaurant.FavoritedUsers.length,
        isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(restaurant.id),
      }))
      restaurants = restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
      console.log(restaurants)
      res.render('topRestaurant', {restaurants: restaurants})
    })
  },
  getDashBoard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [
      Category, {model: Comment}
    ]}).then((restaurant) => {
      return res.render('dashboard', {restaurant: restaurant.toJSON()})
    })
  },
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {restaurants: restaurants, comments: comments})
    })
  },
}

module.exports = restController