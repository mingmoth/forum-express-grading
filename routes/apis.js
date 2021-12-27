const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController')
// const restController = require('../controllers/api/restController')
// const userController = require('../controllers/api/userController')
// const commentController = require('../controllers/api/commentController')

router.get('/admin/restaurants', adminController.getRestaurants)

module.exports = router