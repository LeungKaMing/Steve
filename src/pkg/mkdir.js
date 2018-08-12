const fs = require('fs')
const path = require('path')
const readline = require('readline');
const os = require('os');

const rm = require('./rm')

/**
 * use: 从指定配置模版进行注入，创建配置文件
 * why:
 * how:
 * params:
 */
let webpackBaseTemplate = path.resolve(__dirname, './buildToolsTemplate/webpack.template.txt');
let rootDir = path.resolve(__dirname, '../../project/vue/')

function injectConfig (fReadName, fWriteName) {
	let fRead = fs.createReadStream(fReadName);
	let fWrite = fs.createWriteStream(fWriteName);
	
	let objReadline = readline.createInterface({
			input: fRead,
			terminal: true
	});

	objReadline.on('line', (line)=>{
		let temp = ''   // 由于逐行读取不能覆盖原有值，所以用容器装起来
		const entryReg = /{{entryParams}}/
		const outputReg = /{{outputParams}}/
		const ruleReg = /{{ruleParams}}/
		const templateReg = /{{templateParams}}/
		const authorReg = /{{author}}/

		// 默认配置规则
		const rulesDefault = "[{test: /\.css$/,use: ExtractTextPlugin.extract({fallback: 'style-loader',use: 'css-loader'})},{test: /\.(png|svg|jpg|gif)$/,use: ['file-loader']},{test: /\.(woff|woff2|eot|ttf|otf)$/,use: ['file-loader']}]"

		// 默认模板插件参数
		const templateDefault = "{title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/index.html'),filename: path.resolve(__dirname, '../dist/index.html'),inject: true,minify: true,showErrors: true}"

		// 先随便配点
		if (entryReg.test(line)) {
			// 入口
			temp = line.replace(entryReg, "{app: path.resolve(__dirname, '../src/entry/index.js')}")
		} else if (outputReg.test(line)) {
			// 出口
			temp = line.replace(outputReg, "{filename: '[name].[hash].js',path: path.resolve(__dirname, '../dist/assets/'),publicPath: '/assets/',chunkFilename: '[name].[hash].js'}")
		} else if (ruleReg.test(line)) {
			// 规则
			temp = line.replace(ruleReg, rulesDefault)
		} else if (templateReg.test(line)) {
			// 模板插件配置
			temp = line.replace(templateReg, templateDefault)
		} else if (authorReg.test(line)) {
			// 模板插件配置
			temp = line.replace(authorReg,  String(new Date().toLocaleString()) + ', written by Leung.')
		} else {
			temp = line
		}
		fWrite.write(temp + os.EOL); // 下一行
	});

	objReadline.on('close', ()=>{
		console.log('readline close...');
		// 判断是否生成了模板 => 是则把build/webpack.base.config.js替换掉
		if (fs.existsSync(fWriteName)) {
			fs.copyFileSync(fWriteName, path.resolve(__dirname, '../../build/webpack.base.config.js'));
		}
	})
}

/**
 * use: 用于判断上一级目录是否存在，并做相关操作
 * @param {*} pathWay 当前目录
 * @param {*} lastTimePathWay 上一次的目录
 */
function checkBaseDir (pathWay, lastTimePathWay) {
	if (fs.existsSync(pathWay)) {
		// 创建上一次临时存起的目录，这个目录是当前目录的子目录
		// 翻check最初的目录
		fs.mkdirSync(lastTimePathWay)
	} else if (!fs.existsSync(pathWay)) {
		// 当前目录不存在，则把该目录的上一级目录继续递归
		checkBaseDir(path.dirname(pathWay), pathWay)
	}
}

/**
 * use：实现创建某个目录下的所有文件
 * why：
 * how：
 * params：-p 创建vue示例目录 -- mkfile() -t 在vue示例目录创建配置文件 -- injectConfig()
 */
function mkfile (rootDir) {
	if (fs.existsSync(rootDir)) {
		// console.log('有就不会创建啦，傻的咩')
		// 存在则走正常逻辑
		process.argv.slice(2).forEach((arg) => {
			arg = arg.replace(/-/g, '')
			switch (arg) {
		case 'p':
		case 'project':
				// 判断传入的参数是文件还是目录
				let fileStat = fs.statSync(rootDir)
				if (fileStat.isDirectory()) {
					// 文件状态判断为目录
					const fileList = fs.readdirSync(rootDir)
					// console.log(`>>>>>demo/目录下有什么文件呢？期望为空：${fileList.length}`)
					const readyToDir = [path.resolve(__dirname, `${rootDir}/build`), path.resolve(__dirname, `${rootDir}/src`), path.resolve(__dirname, `${rootDir}/src/assets`), path.resolve(__dirname, `${rootDir}/src/assets/style`), path.resolve(__dirname, `${rootDir}/src/assets/images`), path.resolve(__dirname, `${rootDir}/src/assets/scripts`), path.resolve(__dirname, `${rootDir}/src/assets/template`), path.resolve(__dirname, `${rootDir}/src/components`), path.resolve(__dirname, `${rootDir}/src/entry`), path.resolve(__dirname, `${rootDir}/src/store`), path.resolve(__dirname, `${rootDir}/src/router`), path.resolve(__dirname, `${rootDir}/src/config`)]

					readyToDir.forEach((itemDir) => {
						if (!fs.existsSync(itemDir)) {
							checkBaseDir(path.dirname(itemDir), itemDir)	// 检查并最终创建目录后，递归
							if (itemDir === path.resolve(__dirname, `${rootDir}/build`)) {
								injectConfig(webpackBaseTemplate, path.resolve(__dirname, `${itemDir}/webpack.base.config.js`))
							}
						} else {
								console.log(`已经存在 ${itemDir}`)
						}						
					})
				} else {
						// 文件状态判断为文件
						console.log('>>>>>这是文件啊')
				}
				break
			case 'd':
				rm('../../project', '../../project')
				break
			}
		})
	} else {
		console.log(1)
		checkBaseDir(path.dirname(rootDir), rootDir)	// 检查并最终创建目录后，递归
		mkfile(rootDir)
	}
}

// execute
mkfile(rootDir)
