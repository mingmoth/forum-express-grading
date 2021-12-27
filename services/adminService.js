const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminService = {
  // get all restaurants
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then(restaurant => {
      // 只需要處理「一筆資料」時，我們會建議用 .toJSON() 把 Sequelize 回傳的整包物件直接轉成 JSON 格式
      callback({ restaurant: restaurant.toJSON() })
    })
  },
  // get all Categories
  getCategories: (req, res, callback) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id).then((category) => {
          callback({ category: category.toJSON(), categories: categories })
        })
      } else {
        callback({ categories: categories })
      }
    })
  },
  postCategory: async(req, res , callback) => {
    if (!req.body.newCategory) {
      callback({status: 'error', message:"請填寫餐廳類別名稱"})
    }
    const check = await Category.findOne({ where: { name: req.body.newCategory } })
    if (check) {
      callback({status: 'error', message:"餐廳類別名稱重複"})
    } else {
      Category.create({
        name: req.body.newCategory
      }).then(categories => {
        callback({status: 'success', message: '餐廳類別新增成功'})
      })
    }
  },
  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({status:'error', message:"請填寫餐廳類別名稱"})
    }
    Category.findByPk(req.params.id).then(category => {
      category.update({
        name: req.body.name
      }).then(() => {
        callback({status:'success', message:'餐廳類別更新成功'})
      })
    })
  },
  deleteCategory: (req, res,callback) => {
    return Category.findByPk(req.params.id).then((category) => {
      category.destroy().then(() => {
        callback({status: 'success', message:'餐廳類別刪除成功'})
      })
    })
  },
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({status: 'error', message: "請填寫餐廳名稱"})
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
          callback({ status:'success', message: '成功新增餐廳與圖片'})
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
          callback({ status: 'success', message:'成功新增餐廳'})
        })
    }
  },
  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "請填寫餐廳名稱"})
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
            callback({status: 'success', message:'已成功更新餐廳資訊與圖片'})
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
              callback({ status: 'success', message: '已成功更新餐廳資訊' })
            })
        })
    }
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({status: 'success', message: '成功刪除餐廳'})
          })
      })
  }
}

module.exports = adminService