const adminControllers = require('../controllers/adminControllers.js')
const restControllers = require('../controllers/restControllers.js')
const userControllers = require('../controllers/userControllers.js')
module.exports = (app) => {
  // 前台
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restControllers.getRestaurants)
  // 註冊
  app.get('/signup', userControllers.SignUpPage)
  app.post('/signup', userControllers.SignUp)
  // admin(後台)
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminControllers.getRestaurants)
}
