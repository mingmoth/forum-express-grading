const bcrypt = require('bcryptjs')
const req = require('express/lib/request')
const { resetWatchers } = require('nodemon/lib/monitor/watch')
const db = require('../models')
const User = db.User

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
    return User.findByPk(req.params.id).then(user => {
      return res.render(`profile`, { user: user.toJSON(), userId: req.user.id })
    })
  },
  editUser: (req, res) => {
    let queryId = req.params.id
    console.log('user:', req.user.id, '/ query:', queryId)
    if(Number(req.user.id) !== Number(req.params.id)) {
      req.flash('error_messages', '非當前使用者')
      return res.redirect('back')
    }
    return User.findByPk(req.params.id).then((user) => {
      return res.render('edit', { user: user.toJSON() })
    })
  },
}

module.exports = userController