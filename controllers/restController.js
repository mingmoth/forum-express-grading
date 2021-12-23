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
        categoryName: r.dataValues.Category.name
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
      {model: Comment, include: [User]}]
    }).then(restaurant => {
      console.log(restaurant)
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
      // const data = ({
      //   ...restaurant.dataValues,
      //   categoryName: restaurant.dataValues.Category.name
      // })
      // return res.render('restaurant', {restaurant: data})
    })
  }
}

module.exports = restController