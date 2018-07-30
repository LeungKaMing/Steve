const http = require('http')
const path = require('path')
const {exec} = require('child_process')
const fs = require('fs')

// 已经实现了类似webpack的插件clean-webpack-plugin功能
const rm = require('./pkg/rm')

let webpackBundleResult = false

// 服务 启动/重启 都会执行【删除dist目录】
rm('../dist', '../dist')

function handleArgv (req) {
    return new Promise((resolve, reject) => {
        process.argv.slice(2).forEach((arg) => {
            arg = arg.replace(/-/g, '')
            switch (arg) {
                case 'demo':
                    // 读取文件
                    let result = ''
                    const readStream = fs.createReadStream(path.join(__dirname, './template/index.html'))
                    readStream.on('data', (chunk) => {
                        result += chunk
                    });
                    readStream.on('end', () => {
                        res.end(result)
                    });
                    break
                case 'cp':
                    // 子进程
                    exec('node ./demo.js', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                    })
                    break
                case 'webpack':
                    // webpack
                    if (!webpackBundleResult) {
                        exec('npm run webpack', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                reject('webpack bundle fail')
                                return;
                            }
                            console.log('>>>>>>webpack构建完成<<<<<<<')
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
                    exec('npm run parcel', (error, stdout, stderr) => {
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
                    exec('npm run rollup', (error, stdout, stderr) => {
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
                        res.writeHead(200,{'Content-Type':'text/css'})
                        assestsResult = `../src/assets/style/index.css`
                        break
                    case 'js':
                        assestsResult = `../dist/${req.url}`
                        break
                    default:
                        assestsResult = `../dist/assets${req.url}`
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