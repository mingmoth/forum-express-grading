const db = require('../models')
const Restaurant = db.Restaurant

const adminControllers = {
  // get all restaurants
  getRestaurants: (req, res) => {
    return Restaurant.findAll({raw: true}).then(restaurants => {
      return res.render('admin/restaurants', {restaurants: restaurants})
    })
  },
  // get one restaurant
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw: true}).then(restaurant => {
      return res.render('admin/restaurant', {restaurant: restaurant})
    })
  },
  // create page
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  // create new restaurant
  postRestaurant: (req, res) => {
    if(!req.body.name) {
      req.flash('error_messages', "請填寫餐廳名稱")
      return res.redirect('back')
    }
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    })
      .then((restaurant) => {
        req.flash('success_messages', '成功新增餐廳')
        res.redirect('/admin/restaurants')
      })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw: true}).then((restaurant) => {
      return res.render('admin/create', {restaurant: restaurant})
    })
  },
  putRestaurant: (req, res) => {
    if(!req.body.name) {
      req.flash('error_messages', "請填寫餐廳名稱")
      return res.redirect('back')
    }
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description
        })
        .then((restaurant) => {
          req.flash('success_messages', '成功更新餐廳資訊')
          res.redirect(`/admin/restaurants/${req.params.id}`)
        })
      })
  }
}

module.exports = adminControllers