const http = require('http')
const path = require('path')
const {exec} = require('child_process')
const fs = require('fs')

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
                            // console.log(`stdout: ${stdout}`);
                            // console.log(`stderr: ${stderr}`);
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
            } else if (req.url === '/favicon.ico') {
                res.end('favicon.ico')
            } else {
                // 除js外的静态资源
                let assestsResult = ''
                let extname = path.extname(req.url).substring(1)
                switch (extname) {
                    case 'css':
                    case 'woff':
                        let matchFile
                        if (extname === 'css') {
                            res.writeHeader(200, {'Content-Type':'text/css;charset=UTF-8'})
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
                            if (matchFile.test(item)) {
                                // dist目录下的woff后缀文件 跟 请求url不相等，以前者为准
                                if(item !== requestFile) {
                                    path = `/${item}`
                                } else {
                                    path = `/${requestFile}`
                                }
                            }
                        })
                        assestsResult = `../dist/assets${path}`
                        break
                    default:
                        assestsResult = `../dist${req.url}`
                }
                fs.createReadStream(path.join(__dirname, assestsResult)).pipe(res)
            }
            break
        default:
            fs.end('bundle fail no matter what bundle tool u r using.')
            break
    }
   
})

server.listen(8080, () => {
    console.log('启动服务，端口为8080')
})