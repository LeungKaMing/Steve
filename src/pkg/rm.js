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
function rm (dir, temp) {
    !!temp ? firstDirPath = dir : ''
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
                // console.log(`删除完当前目录的目录后，检查第一次传入的目录：${fs.existsSync(firstDirPath)}, ${firstDirPath}`)
                
                if (fs.existsSync(firstDirPath)) {
                    let subFileList = fs.readdirSync(firstDirPath)
                    // 注意：0814 这里的subFileList非空时为包含了【其他目录】的数组；当这个数组为空时，一定要把【最初目录firstDirPath】传入去，把最初目录也删掉！
                    if (subFileList) {
                        // 内部递归就不用传入第二个参数，第二个参数是由【调用当前模块的 模块】来传入，用于保存【最初目录firstDirPath】
                        rm(path.join(`${firstDirPath}`))
                    }
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
                        // 每次删除完某个目录下的文件后，都应该要再来检查一下当前目录是否已经没有文件了
                        if (fs.existsSync(dir)) {
                            let subFileList = fs.readdirSync(dir)
                            if (!subFileList.length) {
                                // 如果【当前目录】为空，那么将【当前目录】丢进去再次递归，把【当前目录】删除
                                rm(path.join(`${dir}`))
                            }
                        }
                    })
                }
            })
        }
    }
}

module.exports = rm