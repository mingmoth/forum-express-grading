const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminService = require('../services/adminService')

const adminController = {
  // get all Categories
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
    // Category.findAll({
    //   raw: true,
    //   nest: true
    // }).then(categories => {
    //   if (req.params.id) {
    //     Category.findByPk(req.params.id).then((category) => {
    //       return res.render('admin/categories', { category: category.toJSON(), categories: categories })
    //     })
    //   } else {
    //     return res.render('admin/categories', { categories: categories })
    //   }
    // })
  },
  // create Category
  postCategory: async(req, res) => {
    if (!req.body.newCategory) {
      req.flash('error_messages', "請填寫餐廳類別名稱")
      return res.redirect('back')
    }
    const check = await Category.findOne({where: {name: req.body.newCategory}})
    if(check) {
      req.flash('error_messages', "餐廳類別名稱重複")
      return res.redirect('back')
    } else {
      Category.create({
        name: req.body.newCategory
      }).then(categories => {
        req.flash('success_messages', '餐廳類別新增成功')
        res.redirect('/admin/categories')
      })
    }
    
  },
  // update one Category
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "請填寫餐廳類別名稱")
      return res.redirect('back')
    }
    Category.findByPk(req.params.id).then(category => {
      category.update({
        name: req.body.name
      }).then(() => {
        req.flash('success_messages', '餐廳類別更新成功')
        res.redirect('/admin/categories')
      })
    })
  },
  // delete one Category
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id).then((category) => {
      category.destroy().then(() => {
        req.flash('success_messages', '餐廳類別刪除成功')
        res.redirect('/admin/categories')
      })
    })
  },
  // get all Users
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then((users) => {
      return res.render('admin/users', { users: users })
    })
  },
  // toggle user isAdmin
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      if (user.email === 'root@example.com') {
        req.flash('error_messages', "禁止變更管理者權限")
        return res.redirect('back')
      } else {
        user.update({
          isAdmin: !user.isAdmin
        }).then((user) => {
          req.flash('success_messages', '使用者權限變更成功')
          res.redirect('/admin/users')
        })
      }
    })
  },
  // get all restaurants
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  // get one restaurant
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  // create page
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    }).then(categories => {
      return res.render('admin/create', { categories: categories })
    })
  },
  // create new restaurant
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "請填寫餐廳名稱")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId,
        }).then((restaurant) => {
          req.flash('success_messages', '成功新增餐廳與圖片')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId,
      })
        .then((restaurant) => {
          req.flash('success_messages', '成功新增餐廳')
          res.redirect('/admin/restaurants')
        })
    }
  },
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant.toJSON()
        })
      })
    })

  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image
          }).then((restaurant) => {
            req.flash('success_messages', '已成功更新餐廳資訊與圖片')
            res.redirect(`/admin/restaurants/${req.params.id}`)
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

module.exports = adminController