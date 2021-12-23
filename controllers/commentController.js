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
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then((comment) => {
        comment.destroy()
          .then((comment) => {
            req.flash('success_messages', '成功刪除餐廳評論')
            res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  },
  
}

module.exports = commentController