const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 9

const restController = {
  getRestaurants: (req, res) => {
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
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
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
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: 
      [Category,
        // 這在資料庫的術語裡叫做 eager loading，是預先加載的意思
      {model: User, as: 'FavoritedUsers'},
      {model: Comment, include: [User]}]
    }).then(async(restaurant) =>  {
      await restaurant.increment('viewCounts')
      console.log(restaurant.dataValues.name, restaurant.dataValues.viewCounts)
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      })
      // const data = ({
      //   ...restaurant.dataValues,
      //   categoryName: restaurant.dataValues.Category.name
      // })
      // return res.render('restaurant', {restaurant: data})
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