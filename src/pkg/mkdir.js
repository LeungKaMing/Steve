const fs = require('fs')
const path = require('path')
const readline = require('readline');

// let data = ''
// // 统一webpack基础配置 ok
// const readStream = fs.createReadStream(path.resolve(__dirname, '../../build/1webpack.base.config.js'))
// // const demoConfig = fs.createWriteStream('./demo.js')
// // readStream.pipe(demoConfig)
// readStream.on('data', (chunk) => {
//     data += chunk
// });
// readStream.on('end', () => {
//     console.log('There will be no more data:\n', data);
// });


var os = require('os');
 
var fReadName = path.resolve(__dirname, '../../build/webpack.template.txt');
var fWriteName = path.resolve(__dirname, './targetWebpack.js'); // 最终生成的webpack配置
var fRead = fs.createReadStream(fReadName);
var fWrite = fs.createWriteStream(fWriteName);
 
var objReadline = readline.createInterface({
	input: fRead,
    terminal: true
});

objReadline.on('line', (line)=>{
    let temp = ''   // 由于逐行读取不能覆盖原有值，所以用容器装起来
    const entryReg = /{{entryParams}}/g
    // const entryReg = /{{entryParams}}/g
    if (entryReg.test(line)) {
        temp = line.replace(entryReg, "{app: path.resolve(__dirname, '../src/entry/index.js')}")    // 先随便配点
    } else {
        temp = line
    }
	fWrite.write(temp + os.EOL); // 下一行
});
 
objReadline.on('close', ()=>{
	console.log('readline close...');
})

/** =================分界线 关于文件夹创建已经ok，剩余写入配置文件======================= */

/**
 * use：实现创建某个目录下的所有文件
 * why：
 * how：
 * 1.先检查下当前目录在根目录下(待定)是否存在
 * 2.fs.mkdirSync
 * 3.child_process.exec('cd 目录/')
 * 4.fs.mkdirSync
 * params：-demo 
 */
// function mkfile () {
//     process.argv.slice(2).forEach((arg) => {
//         arg = arg.replace(/-/g, '')
//         switch (arg) {
//             case 'demo':
//                 // if (fs.existsSync(path.resolve(__dirname, './demo.txt'))) {
//                 //     // 可写文件存在
//                 //     let data = ''
//                 //     const readStream = fs.createReadStream(path.resolve(__dirname, './demo.txt'))
//                 //     readStream.on('data', (chunk) => {
//                 //         data += chunk
//                 //     })
//                 //     readStream.on('end', () => {
//                 //         fs.writeFileSync(path.resolve(__dirname, './demo.txt'), `${data}right now!\n`)
//                 //     })
//                 // } else {
//                 // }

//                 // 可写文件不存在 <= 0808
//                 // const rootDir = path.resolve(__dirname, './demo')
//                 // if (fs.existsSync(rootDir)) {
//                 //     console.log('已经存在 demo/')
//                 // } else {
//                 //     console.log('创建 demo/ 成功')
//                 //     fs.mkdirSync(rootDir)
//                 // }
//                 // let fileStat = fs.statSync(rootDir)
//                 // if (fileStat.isDirectory()) {
//                 //     // 文件状态判断为目录
//                 //     const fileList = fs.readdirSync(rootDir)
//                 //     console.log(`>>>>>demo/目录下有什么文件呢？期望为空：${fileList.length}`)
//                 //     // 往demo/ 目录下创建文件 => 来个webpack.config.js先吧 笑
//                 //     const subDir = path.resolve(__dirname, './demo/build')
//                 //     if (fs.existsSync(subDir)) {
//                 //         console.log('已经存在 /demo/build/webpack.config.js')
//                 //     } else {
//                 //         console.log('创建 /demo/build/webpack.config.js 成功')
//                 //         fs.mkdirSync(subDir)
//                 //         const writeFile = fs.createWriteStream(path.resolve(__dirname, `${subDir}/webpack.config.js`))
//                 //         // 开始编写配置文件 => copy一份模版 / 逐行写入？
//                 //         writeFile.write('123\n')
//                 //         writeFile.end('done!')
//                 //     }
//                 // } else {
//                 //     // 文件状态判断为文件
//                 //     console.log('>>>>>这是文件啊')
//                 // }
//                 break
//         }
//     })
// }
// mkfile()
