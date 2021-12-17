const db = require('../models')
const Restaurant = db.Restaurant

const adminControllers = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({raw: true}).then(restaurants => {
      return res.render('admin/restaurants', {restaurants: restaurants})
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
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
  }
}

module.exports = adminControllers