const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    if(!req.body.text) {
      req.flash('error_messages', "請填寫餐廳評論")
      return res.redirect('back')
    }
    return Comment.create({
      text: req.body.text,
      UserId: req.user.id,
      RestaurantId: req.body.restaurantId
    }).then(() => {
      req.flash('success_messages', '餐廳評論新增成功')
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  }
}

module.exports = commentController