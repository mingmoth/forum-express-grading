const moment = require('moment/min/moment-with-locales')
moment.locale('zh-TW')
module.exports = {
  ifCond: function(a, b, options) {
    if(a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  fromNow: function(a) {
    return moment(a).fromNow()
  }
}