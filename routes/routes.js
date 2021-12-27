const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const helpers = require('../_helpers')
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const commentController = require('../controllers/commentController.js')

// 這個temp資料夾是暫時的，通常定期會清空
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


// 驗證登入
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}
// 前台
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
// 後台
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
// 註冊
router.get('/signup', userController.SignUpPage)
router.post('/signup', userController.SignUp)

// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

// admin(後台)
router.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.get('/admin/categories', authenticatedAdmin, adminController.getCategories)
// admin get one category
router.get('/admin/categories/:id', authenticatedAdmin, adminController.getCategories)
// admin create new category
router.post('/admin/categories', authenticatedAdmin, adminController.postCategory)
// admin delete one category
router.delete('/admin/categories/:id', authenticatedAdmin, adminController.deleteCategory)
// admin update one category
router.put('/admin/categories/:id', authenticatedAdmin, adminController.putCategory)
// admin toggle user isAdmin
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)
// admin go one Restaurant edit page
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
// admin edit one Restaurnat
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

// admin go create Restaurant page
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
// admin  create Restaurant
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

// admin get one Restaurant
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

// admin delete one Restaurant
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


// 前台頁面
// all Restaurants
router.get('/restaurants', authenticated, restController.getRestaurants)
// 但這樣因為 '/restaurants/feeds' 這組字串也符合動態路由 '/restaurants/:id' 的結構，會被視為「:id 是 feeds」而導向單一餐廳的頁面
// Feeds
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

// Top Restaurants
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
// one Restaurant
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// Restaurant Dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashBoard)
// create comment in one Restaurant page
router.post('/comments', authenticated, commentController.postComment)
// delete comment in Restaurant page
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// getTopUsers
router.get('/users/top', authenticated, userController.getTopUser)
// 使用者頁面
router.get('/users/:id', authenticated, userController.getUser),
  // 使用者編輯頁
  router.get('/users/:id/edit', authenticated, userController.editUser)
// 編輯使用者頁面
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
// 將餐廳收藏
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
// 取消餐廳收藏
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// 按讚收回讚
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

//addFollowing
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

module.exports = router


