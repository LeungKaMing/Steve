const http = require('http')
const {exec} = require('child_process')
const fs = require('fs')

const server = http.createServer((req, res) => {
    process.argv.slice(2).forEach((arg) => {
        arg = arg.replace(/-/g, '')
        switch (arg) {
            case 'demo':
                // 读取文件
                let result = ''
                const readStream = fs.createReadStream('../template/index.html')
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
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); 
                    res.end('Hello World!')
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