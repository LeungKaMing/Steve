const Vue = require('vue')

module.exports = function createAppFactory (context) {
  return new Vue({
    template: `<div>访问的 URL 是： {{ url }}</div>`,
    data: {
      url: context.url
    },
    beforeCreate() {
        console.log('in beforeCreate')
    },
    created() {
        console.log('in created')
    }
  })
}