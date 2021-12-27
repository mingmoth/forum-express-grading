const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/'})

const adminController = require('../controllers/api/adminController')
// const restController = require('../controllers/api/restController')
// const userController = require('../controllers/api/userController')
// const commentController = require('../controllers/api/commentController')

router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRetaurant)
router.get('/admin/categories', adminController.getCategories)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

module.exports = router