import "babel-polyfill";
const Vue = require('vue')
const VueServerRender = require('vue-server-renderer')

const app = new Vue({
    template: '<div>Hello Vue SSR</div>'
})

const renderer = VueServerRender.createRenderer({})

renderer.renderToString(app, (err, html) => {
    if (err) throw err
    console.log('0910输出html：', html)
})
// // 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
// renderer.renderToString(app).then(html => {
//     console.log(html)
//   }).catch(err => {
//     console.error(err)
//   })