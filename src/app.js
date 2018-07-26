const http = require('http')
const path = require('path')
const {exec} = require('child_process')
const fs = require('fs')

const rm = require('./pkg/rm')

// 服务 启动/重启 都会执行【删除dist目录】
rm('../dist', '../dist')

const server = http.createServer((req, res) => {
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
                exec('npm run webpack', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    console.log('>>>>>>webpack开始构建<<<<<<<')
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    if (req.url === '/') {
                        let result = ''
                        const readStream = fs.createReadStream('./template/index.html')
                        readStream.on('data', (chunk) => {
                            result += chunk
                        });
                        readStream.on('end', () => {
                            res.writeHeader(200, {'Content-Type':'text/html;charset=UTF-8'})
                            res.end(result)
                        });
                    } 
                    else if (req.url === '/bundle.js') {
                        res.writeHead(200,{'Content-Type':'application/javascript'})
                        fs.createReadStream(path.join(__dirname, '../dist/bundle.js')).pipe(res)
                    } else {
                        let extname = path.extname(req.url).substring(1)
                        switch (extname) {
                            case 'jpg':
                                res.writeHead(200,{'Content-Type':'image/jpeg'})
                                fs.createReadStream(path.join(__dirname, `../dist${req.url}`)).pipe(res)
                                break
                        }
                    }
                })
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

server.listen(8080, () => {
    console.log('启动服务，端口为8080')
})