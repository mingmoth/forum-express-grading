const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 9
const helpers = require('../_helpers')

const restService  = {
  getRestaurants: (req, res, callback) => {
    let offset = 0
    const cateQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      cateQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: cateQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.length > 50 ? r.dataValues.description.substring(0, 50) + '...' : r.dataValues.description,
        categoryName: r.dataValues.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        callback({
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })

    })
  },
  getTopRestaurant: (req, res, callback) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    }).then(restaurants => {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.description.length > 50 ? restaurant.description.substring(0, 50) + '...' : restaurant.description,
        favoritedCount: restaurant.FavoritedUsers.length,
        isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(restaurant.id),
      }))
      restaurants = restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
      // console.log(restaurants)
      callback({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include:
        [Category,
          // 這在資料庫的術語裡叫做 eager loading，是預先加載的意思
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' },
          { model: Comment, include: [User] }]
    }).then(async (restaurant) => {
      await restaurant.increment('viewCounts')
      callback({
        restaurant: restaurant.toJSON(),
        isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id),
        isLiked: restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      })
    })
  },
  getDashBoard: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category, { model: Comment }
      ]
    }).then((restaurant) => {
      callback({ restaurant: restaurant.toJSON() })
    })
  },
  getFeeds: (req, res, callback) => {
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
      callback({ restaurants: restaurants, comments: comments })
    })
  },
}

module.exports = restService