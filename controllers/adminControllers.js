const db = require('../models')
const fs = require('fs')
const Restaurant = db.Restaurant

const adminControllers = {
  // get all restaurants
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },
  // get one restaurant
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant: restaurant })
    })
  },
  // create page
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  // create new restaurant
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "請填寫餐廳名稱")
      return res.redirect('back')
    }
    const { file } = req
    if(file) {
      fs.readFile(file.path, (err, data) => {
        if(err) console.log("Error: ", err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? `upload/${file.originalname}` : null
          }).then((restaurant) => {
            req.flash('success_messages', '成功新增餐廳與圖片')
            return res.redirect('/admin/restaurants')
          })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      })
        .then((restaurant) => {
          req.flash('success_messages', '成功新增餐廳')
          res.redirect('/admin/restaurants')
        })
    }
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then((restaurant) => {
      return res.render('admin/create', { restaurant: restaurant })
    })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if(file) {
      fs.readFile(file.path, (err, data) => {
        if(err) console.log("Error: ", error)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id).then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? `/upload/${file.originalname}` : restaurant.image
            }).then((restaurant) => {
              req.flash('success_messages', '已成功更新餐廳資訊與圖片')
              res.redirect(`/admin/restaurants/${req.params.id}`)
            })
          })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: null
          })
            .then((restaurant) => {
              req.flash('success_messages', '已成功更新餐廳資訊')
              res.redirect(`/admin/restaurants/${req.params.id}`)
            })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            req.flash('success_messages', '成功刪除餐廳')
            res.redirect('/admin/restaurants')
          })
      })
  }
}

module.exports = adminControllers