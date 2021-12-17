const restControllers = require('../controllers/restControllers.js')
const adminControllers = require('../controllers/adminControllers.js')
const userControllers = require('../controllers/userControllers.js')

module.exports = (app, passport) => {
  // 驗證登入
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  // 前台
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restControllers.getRestaurants)
  // 後台
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminControllers.getRestaurants)
  // 註冊
  app.get('/signup', userControllers.SignUpPage)
  app.post('/signup', userControllers.SignUp)

  // 登入
  app.get('/signin', userControllers.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userControllers.signIn)
  app.get('/logout', userControllers.logout)

  // admin(後台)
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminControllers.getRestaurants)
  // go one Restaurant edit page
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminControllers.editRestaurant)
  // edit one Restaurnat
  app.put('/admin/restaurants/:id', authenticatedAdmin, adminControllers.putRestaurant)

  // go create Restaurant page
  app.get('/admin/restaurants/create', authenticatedAdmin, adminControllers.createRestaurant)
  // create Restaurant
  app.post('/admin/restaurants', authenticatedAdmin, adminControllers.postRestaurant)

  // get one Restaurant
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminControllers.getRestaurant)

  // delete one Restaurant
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminControllers.deleteRestaurant)


}
