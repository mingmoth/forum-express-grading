const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../../_helpers')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const db = require('../../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

let userController = {
  signIn: (req, res) => {
    if(!req.body.email || !req.body.password) {
      return res.json({status: 'error', message: '請填寫帳戶及密碼'})
    }
    let username = req.body.email
    let password = req.body.password

    User.findOne({where: {email: username}}).then((user) => {
      if(!user) return res.status(401).json({status: 'error', message: '找不到使用者'})
      if(!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({status: 'error', message: '密碼不正確'})
      }
      let payload = {id: user.id}
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: '成功登入',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    })
  },
  signUp: (req, res) => {
    if(!req.body.name || !req.body.email) {
      return res.json({status: 'error', message: '請輸入名稱及電子郵件'})
    }
    if (req.body.password !== req.body.passwordCheck) {
      return res.json({ status: 'error', message: '兩次密碼輸入不一致' })
    }
    User.findOne({where: {email: req.body.email}}).then(user => {
      if(user) {
        return res.json({status: 'error', message: '此信箱已註冊使用'})
      } else {
        return User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        }).then(user=> {
          return res.json({status: 'success', message: '成功註冊使用者'})
        })
      }
    })
  }
}

module.exports = userController