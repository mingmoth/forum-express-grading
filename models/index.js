'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config/config.json')[env]
const db = {}

// 資料庫連線
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// 利用 Node.js 內建的檔案管理模組 fs (全名 file system)，尋找在 models 目錄底下以 .js 結尾的檔案。找到檔案以後，運用 sequelize 將其引入。
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  // 例如，假設有個 model 檔案 User.js，被 fs 掃描到且引入進來，之後就可以用 db.User 來存取到這個 Model。
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

// 設定 Models 之間的關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// 匯出需要的物件
// db.sequelize 代表連線資料庫的 instance
// 用 db.Sequelize 存取到 Sequelize 這個 class，代表 Sequelize 函式庫本身
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
