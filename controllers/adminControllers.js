const adminControllers = {
  getRestaurants: (req, res) => {
    console.log('admin')
    return res.render('admin/restaurants')
  }
}

module.exports = adminControllers