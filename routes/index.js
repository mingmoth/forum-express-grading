const helpers = require('../_helpers')
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const commentController = require('../controllers/commentController.js')

// 這個temp資料夾是暫時的，通常定期會清空
const multer = require('multer')
const upload = multer({dest: 'temp/'})

module.exports = (app, passport) => {
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
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  // 後台
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  // 註冊
  app.get('/signup', userController.SignUpPage)
  app.post('/signup', userController.SignUp)

  // 登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  // admin(後台)
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/categories', authenticatedAdmin, adminController.getCategories)
  // admin get one category
  app.get('/admin/categories/:id', authenticatedAdmin, adminController.getCategories)
  // admin create new category
  app.post('/admin/categories', authenticatedAdmin, adminController.postCategory)
  // admin delete one category
  app.delete('/admin/categories/:id', authenticatedAdmin, adminController.deleteCategory)
  // admin update one category
  app.put('/admin/categories/:id', authenticatedAdmin, adminController.putCategory)
  // admin toggle user isAdmin
  app.put('/admin/users/:id/toggleAdmin',  authenticatedAdmin, adminController.toggleAdmin)
  // admin go one Restaurant edit page
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  // admin edit one Restaurnat
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  // admin go create Restaurant page
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  // admin  create Restaurant
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  // admin get one Restaurant
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  // admin delete one Restaurant
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


  // 前台頁面
  // all Restaurants
  app.get('/restaurants', authenticated, restController.getRestaurants)
  // 但這樣因為 '/restaurants/feeds' 這組字串也符合動態路由 '/restaurants/:id' 的結構，會被視為「:id 是 feeds」而導向單一餐廳的頁面
  // Feeds
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  // one Restaurant
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  // Restaurant Dashboard
  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashBoard)
  // create comment in one Restaurant page
  app.post('/comments', authenticated, commentController.postComment)
  // delete comment in Restaurant page
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  // 使用者頁面
  app.get('/users/:id', authenticated, userController.getUser),
  // 使用者編輯頁
  app.get('/users/:id/edit', authenticated, userController.editUser)
  // 編輯使用者頁面
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
  // 將餐廳收藏
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  // 取消餐廳收藏
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
}


