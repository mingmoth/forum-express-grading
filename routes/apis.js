const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/'})

const passport = require('../config/passport')

const adminController = require('../controllers/api/adminController')
const restController = require('../controllers/api/restController')
const userController = require('../controllers/api/userController')
// const commentController = require('../controllers/api/commentController')

// passport middleware
const authenticated = passport.authenticate('jwt', {session: false})

const authenticatedAdmin = (req, res, next) => {
  if(req.user) {
    if(req.user.isAdmin) {return next()}
    return res.json({status: 'error', message: '無存取權限'})
  } else {
    return res.json({ status: 'error', message: '無存取權限' })
  }
}

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRetaurant)
router.get('/admin/categories', authenticated, authenticatedAdmin, adminController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, adminController.postCategory)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, adminController.putCategory)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, adminController.deleteCategory)
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)

module.exports = router