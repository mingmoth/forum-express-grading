const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userControllers = {
  SignUpPage: (req, res) => {
    return res.render('signup')
  },
  SignUp: (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }).then(user => {
      return res.redirect('/signin')
    })
  },
}

module.exports = userControllers