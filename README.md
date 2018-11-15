# my-cli
## 已办
1. webpack基本配置模板
2. vue基本配置
3. react基本配置
4. 引入状态管理：vuex
5. 引入路由管理：vue-router(包含高级路由用法)
6. 同构：vuessr

## 前端待办
1. 引入状态管理：redux
2. 引入路由管理：react-router
3. 异步状态管理
4. 高级路由用法
5. 同构：react-ssr
6. pwa
7. 单元测试(x factor)
8. angular基本配置(x factor)
9. 增加pc页基本配置(header, content, footer三个基本块)
10. 开发自己的组件(侧方面push自己去看第三方样式库代码，加强css。 x factor)

## 后端待办
1. 增加一条路由：展示页-用于让用户访问不同入口打包生成的静态资源
2. 引入登录/注册功能(单点登录)
3. 引入数据库(mongoDB)
4. nodejs转发服务
5. 将个人系统作为一个官方模板整合进来(x factor)

## 本地调试
~~1. 进入src/pkg~~
~~2. node mkdir.js -p // 创建webpack.base.config.js文件到project/build/目录下，并copy一份到build目录下~~
~~3. npm run webpack:dev // 构建webpack，打包静态资源到dist/目录下~~
~~4. 进入src/~~
~~5. nodemon app.js --webpack:dev // 启动类似webpack-dev-server功能的服务，访问localhost:8080，即可把dist/目录下的静态资源全部加载，除html文件，其余资源热更新~~
> 上述划掉的是之前写demo调试的流程，重构后已作废，后续补上
1.1. npm start - 快速生成目录 (默认vue)
1.2. 如果想根据输入创建目录，暂时用这种方法：
```
node mkdir.js -p=helloworld -f=vue
node mkdir.js -p=helloworld -f=vuessr
```
2. 删除目录
```
// 暂只支持全部删除
node mkdir.js -d
```