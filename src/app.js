const http = require('http')
const path = require('path')
const {exec} = require('child_process')
const fs = require('fs')
const { URL } = require('url'); // 用于url处理与解析 

// 已经实现了类似webpack的插件clean-webpack-plugin功能
const rm = require('./pkg/rm')

let webpackBundleResult = false

// 服务 启动/重启 都会执行【删除dist目录】
rm('../dist', '../dist')

/**
 * @func handleArgv
 * @param {*} req - nodejs的请求参数
 * @desc 仅针对开发环境，根据打包出来的文件来启一个服务，让用户在浏览器可以实时看到对代码的改动 => 1. 有用nodejs + nodemon启服务的(通过命令行) 2. 有用webpack内置的webpack-dev-server插件启服务的(通过脚本)
 */
function handleArgv (req) {
    return new Promise((resolve, reject) => {
        process.argv.slice(2).forEach((arg) => {
            arg = arg.replace(/-/g, '')
            switch (arg) {
                case 'webpack:dev':
                    // webpack
                    if (!webpackBundleResult) {
                        exec('cd ../ && npm run webpack:dev', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                reject('webpack bundle fail')
                                return;
                            }
                            console.log('>>>>>>webpack开发环境构建完成<<<<<<<')
                            webpackBundleResult = true  // 打包完成标识
                            resolve('webpack bundle done')
                        })
                    } else {
                        resolve('webpack bundle done')
                    }
                    break
                case 'webpack:ssr':
                    // webpack
                    if (!webpackBundleResult) {
                        exec('cd ../ && npm run webpack:ssr', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                reject('webpack bundle fail')
                                return;
                            }
                            console.log('>>>>>>webpack ssr环境构建完成<<<<<<<')
                            webpackBundleResult = true  // 打包完成标识
                            resolve('webpack bundle done')
                        })
                    } else {
                        resolve('webpack bundle done')
                    }
                    break
                case 'parcel':
                    // parcel
                    exec('cd ../ && npm run parcel', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); 
                        res.end('Hello World!')
                    })
                    break
                case 'rollup':
                    // rollup
                    exec('cd ../ && npm run rollup', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); 
                        res.end('Hello World!')
                    })
                    break
                default:
                    res.end('Hello World!')
            }
        })
    })
}

const server = http.createServer(async (req, res) => {
    const msg = await handleArgv(req)
    switch (msg) {
        case 'webpack bundle done':
            // webpack成功构建
            if (req.url === '/') {
                let result = ''
                const readStream = fs.createReadStream('../dist/index.html')
                readStream.on('data', (chunk) => {
                    result += chunk
                });
                readStream.on('end', () => {
                    res.writeHeader(200, {'Content-Type':'text/html;charset=UTF-8'})
                    res.end(result)
                });
            } else if (/\/vue.html/.test(req.url)) {
                let result = ''
                const readStream = fs.createReadStream('../dist/vue.html')
                readStream.on('data', (chunk) => {
                    result += chunk
                });
                readStream.on('end', () => {
                    res.writeHeader(200, {'Content-Type':'text/html;charset=UTF-8'})
                    res.end(result)
                });
            } else if (/\/vuessr/.test(req.url)) {
                const isServerBundle = path.join(__dirname, '../dist/assets/vue-ssr-server-bundle.json')
                const isClientBundle = path.join(__dirname, '../dist/assets/vue-ssr-client-manifest.json')
                if (!!fs.existsSync(isServerBundle) && !!fs.existsSync(isClientBundle)) {
                    const {createBundleRenderer} = require('vue-server-renderer')
                    const serverBundle = require(path.join(__dirname, '../dist/assets/vue-ssr-server-bundle.json'))
                    const clientManifest = require(path.join(__dirname, '../dist/assets/vue-ssr-client-manifest.json'))
                    let renderer = createBundleRenderer(serverBundle, {
                        template: fs.readFileSync(path.join(__dirname, './template/vueSSR.html'), 'utf-8'),
                        clientManifest
                    })
                    const orignUrl = 'http://' + req.headers.host + req.url
                    // console.log('>>>>>>>>', orignUrl, req.url)
                    // 渲染上下文对象 => 写法与vue保持一致
                    const templateContext = {
                        title: 'vue ssr demo',
                        meta: `
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        `,
                        url: new URL(orignUrl),
                        tempUrl: req.url
                    }
                    renderer.renderToString(templateContext, (err, html) => {
                        if (err) {
                            console.log(err, '<<<<<')
                            if (err.code === 404) {
                                res.statusCode = 404
                                res.end('Page not found')
                            } else {
                                res.statusCode = 500
                                res.end('SSR Internal Server Error')
                            }
                        } else {
                            res.end(html)
                        }
                    })
                } else {
                    res.end('ssr??')
                }
            } else if (/\/react.html/.test(req.url)) {
                let result = ''
                const readStream = fs.createReadStream('../dist/react.html')
                readStream.on('data', (chunk) => {
                    result += chunk
                });
                readStream.on('end', () => {
                    res.writeHeader(200, {'Content-Type':'text/html;charset=UTF-8'})
                    res.end(result)
                });
            } else if (/favicon\.ico/.test(req.url)) {
                res.end('favicon.ico')
            } else {
                // 除js外的静态资源
                let assestsResult = ''
                let extname = path.extname(req.url).substring(1)
                switch (extname) {
                    case 'css':
                    case 'woff':
                        let flag = false    // 由于splitChunk会连css也进行抽离【带vendors~app开头的】，所以只选dist目录下的由ExtractTextPlugin抽离的为准
                        let matchFile
                        if (extname === 'css') {
                            res.writeHeader(200, {'Content-Type':'text/css;charset=UTF-8', 'ass-hole': 'fuck u'})
                            matchFile = /\w+\.css/g
                        } 
                        if (extname === 'woff') {
                            matchFile = /\w+\.woff/g
                        }
                        let path = ''
                        const list = fs.readdirSync('../dist/assets/')
                        const requestFile = req.url.replace('/', '')
                        // 遍历dist目录下的文件，将匹配woff后缀的文件找出来，跟请求url带woff的做对比：命中则用两者任其一；不命中则用dist目录下皮带woff后缀的文件
                        list.map((item) => {
                            if (matchFile.test(item) && !flag) {
                                // dist目录下的woff后缀文件 跟 请求url不相等，以前者为准
                                if(item !== requestFile) {
                                    path = `/${item}`
                                    flag = true
                                } else {
                                    path = `/${requestFile}`
                                    flag = true
                                }
                            }
                        })
                        assestsResult = `../dist/assets${path}`
                        break
                    default:
                        assestsResult = `../dist${req.url}`
                }
                if (req.url !== '/__webpack_hmr') {
                    // 排除热加载
                    fs.createReadStream(path.join(__dirname, assestsResult)).pipe(res)
                }
            }
            break
        default:
            res.end('bundle fail no matter what bundle tool u r using.')
            break
    }
   
})

server.listen(1234, () => {
    console.log('启动服务，端口为1234')
})