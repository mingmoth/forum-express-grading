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
  },
  // create Category
  postCategory: async(req, res) => {
    adminService.postCategory(req, res, (data) => {
      if(data['status' === 'error']) {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  },
  // update one Category
  putCategory: (req, res) => {
    adminService.putCategory(req, res, (data) => {
      if (data['status' === 'error']) {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  },
  // delete one Category
  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
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
    adminService.postRestaurant(req, res, (data) => {
      if(data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/restaurants')
    })
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
    adminService.putRestaurant(req, res, (data) => {
      if(data['status' === 'error']) {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect(`/admin/restaurants/${req.params.id}`)
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if(data['status'] === 'success') {
        req.flash('success_messages', '成功刪除餐廳')
        return res.redirect('/admin/restaurants')
      }
    })
  }
}

module.exports = adminController