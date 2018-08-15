import '../assets/style/index.css'
import Icon from '../assets/images/luffy.jpg'
import _ from 'lodash'

_.each([1, 2, 3, 4, 5], (item) => console.log(item, '<<<<'))
console.log(window.l, '<<<<<')   // 让全局能app访问第三方依赖的实例

let imgElement = new Image()
imgElement.style.width = '100%'
imgElement.src = Icon

let divElement = document.createElement('div')
divElement.classList.add('hello')

document.getElementById('demo').appendChild(imgElement)
document.getElementById('demo').appendChild(divElement)

// // 尝试webpack动态加载写法 - import() => babel-loader不支持编译
// import('../components/demo').then(res=>{
//     divElement.innerHTML = res.default.demo
//     document.getElementById('demo').appendChild(imgElement)
//     document.getElementById('demo').appendChild(divElement)
// })