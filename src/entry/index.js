import '../assets/style/index.css'
import Icon from '../assets/images/luffy.jpg'

let imgElement = new Image()
imgElement.style.width = '100%'
imgElement.src = Icon

let divElement = document.createElement('div')
divElement.classList.add('hello')
divElement.innerHTML = 'Hello, webpack!'

document.getElementById('app').appendChild(imgElement)
document.getElementById('app').appendChild(divElement)