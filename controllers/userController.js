const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant

const userController = {
  SignUpPage: (req, res) => {
    return res.render('signup')
  },
  SignUp: (req, res) => {
    // confirm
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/signin')
            })
          }
        })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{model: Comment, include: [{model: Restaurant}]}]
    }).then(user => {
      return res.render(`profile`, { user: user.toJSON(), userId: helpers.getUser(req).id })
    })
  },
  editUser: (req, res) => {
    if (Number(helpers.getUser(req).id) !== Number(req.params.id)) {
      req.flash('error_messages', '非當前使用者')
      return res.redirect('back')
    }
    return User.findByPk(req.params.id).then((user) => {
      return res.render('edit', { user: user.toJSON() })
    })
  },
  putUser: (req, res) => {
    if(!req.body.name || !req.body.email) {
      req.flash('error_messages', "請填寫使用者名稱與電子郵件")
      return res.redirect('back')
    }
    const { file } = req
    if(file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user.update({
            ...req.body,
            image: file ? img.data.link : user.image
          }).then(() => {
            req.flash('success_messages', '使用者資料編輯成功')
            res.redirect(`/users/${req.params.id}`)
          })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          ...req.body,
          image: null
        }).then(() => {
          req.flash('success_messages', '使用者資料編輯成功')
          res.redirect(`/users/${req.params.id}`)
        })
      })
    }
    
  }
}

module.exports = userController