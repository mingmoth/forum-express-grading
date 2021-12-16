const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const port = 3000

app.engine('hbs', exphbs({extname: '.hbs'}))
app.set('view engine', 'hbs')

// set body-parser
app.use(express.urlencoded({extended: true}))

// 我們需要用到「快閃訊息 (flash message)」，這種 message 存在 session 裡面
// set session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
// set passport
app.use(passport.initialize())
app.use(passport.session())
// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// 把 passport 傳入 routes
require('./routes')(app, passport)

module.exports = app
