module.exports = {
  plugins: [
    require('autoprefixer'),
    /**
     * 假设设计稿750宽:
     * rootValue为75，说是对根元素大小进行设置
     * unitPrecision为5，转换成rem后保留的小数点位数
     * propList是一个存储哪些将被转换的属性列表，这里设置为['*']全部，假设需要仅对边框进行设置，可以写['*', '!border*']意思是排除带有border的属性，当然这里会有一个问题，也许有时候不想对border其他样式处理例如border-radius所以也不是很好
     * selectorBlackList则是一个对css选择器进行过滤的数组，比如你设置为['fs']，那例如fs-xl类名，里面有关px的样式将不被转换，这里也支持正则写法
     * minPixelValue是一个非常不错的选项，设置了12，意思是所有小于12px的样式都不被转换，那么border之类的属性自然会保留px值了
     */
    require('postcss-pxtorem')({
      rootValue: 75,
      unitPrecision: 5,
      propList: ['*'],  // propList: ['!width*'] 以下写法亲测不对width属性做转换
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 6
    }),
    require('cssnano')({
      preset: 'default',
    })
  ]
}