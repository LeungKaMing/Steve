const fs = require('fs')
const path = require('path')

let firstDirPath

// rm('../../dist', '../../dist')
/**
 * use：实现删除某个目录下所有文件
 * why：因为fs.rmdir这个自带方法只能删除空目录
 * how：所以必须把非空目录下的文件遍历出来，把一个个文件都删除，最后才把目录整个删除
 * params：传入的是要删除的【相对目录名】
 * 1. readdirSync通过这个命令读取的【有可能除了文件，还有目录】
 * 2. 文件则进行删除；目录则递归
 */
function rm (dir, temp, cb) {
    !!temp ? firstDirPath = dir : ''
    console.log('0726: ', dir, fs.existsSync(dir))
    if (fs.existsSync(dir)) {
        // 读取传入目录下的每个文件
        const fileList = fs.readdirSync(dir)
        if (!fileList.length) {
            // 空目录
            fs.rmdir(dir, (err) => {
                if (err) {
                    console.log(`删除目录出错：${err}`)
                }
                console.log(`删除目录${dir}成功`)
                // 每次删除完目录后都应该要来检查一下【第一次传入的目录】是否为非空？
                console.log(`删除完当前目录的目录后，检查第一次传入的目录：${fs.existsSync(firstDirPath)}, ${firstDirPath}`)
                if (fs.existsSync(firstDirPath)) {
                    let subFileList = fs.readdirSync(firstDirPath)
                    if (!subFileList.length) {
                        // 如果【当前目录】为空，那么将【当前目录】丢进去再次递归，把【当前目录】删除
                        rm(path.join(`${firstDirPath}`))
                    }
                } else {
                    console.log('第一次传入的目录也已经删除，good work!')
                }
            })
        } else {
            // 非空目录
            fileList.map((file) => {
                // 获取目录下的每个文件的状态
                let fileStat = fs.statSync(path.join(`${dir}/${file}`))
                if (fileStat.isDirectory()) {
                    // 文件状态判定为目录 => 将【当前路径】连同【当前目录】拼接成一个完整的【相对路径名】再次递归
                    rm(path.join(`${dir}/${file}`))
                } else {
                    // 文件状态判定为文件
                    fs.unlink(path.join(`${dir}/${file}`), (err) => {
                        if (err) {
                            console.log(`删除文件出错：${err}`)
                        }
                        console.log(`删除文件${file}成功`)
                        // 每次删除完文件后是不是应该要来检查一下当前传入的目录是否为非空？
                        console.log(`删除完当前目录的文件后，检查当前目录：${fs.existsSync(dir)}, ${dir}`)
                        if (fs.existsSync(dir)) {
                            let subFileList = fs.readdirSync(dir)
                            if (!subFileList.length) {
                                // 如果【当前目录】为空，那么将【当前目录】丢进去再次递归，把【当前目录】删除
                                rm(path.join(`${dir}`))
                            }
                        } else {
                            console.log('第一次传入的目录也已经删除，good work!')
                        }
                    })
                }
            })
        }
    } else {
        console.log('传入的目录参数已经不再存在！')
    }
}

module.exports = rm