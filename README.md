# my-cli
## 本地调试
1. 进入src/pkg
2. node mkdir.js -p // 创建webpack.base.config.js文件到project/build/目录下，并copy一份到build目录下
3. npm run webpack:dev // 构建webpack，打包静态资源到dist/目录下
4. 进入src/
5. nodemon app.js --webpack:dev // 启动类似webpack-dev-server功能的服务，访问localhost:8080，即可把dist/目录下的静态资源全部加载，除html文件，其余资源热更新