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
                const readable = fs.createReadStream('./template/index.html')
                readable.on('data', (chunk) => {
                    result += chunk
                });
                readable.on('end', () => {
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
                exec('npm start', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
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