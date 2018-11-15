const fs = require('fs')
const path = require('path')
const readline = require('readline');
const os = require('os');

const rm = require('./rm')

// 临时数组，用于存放某个目录下的所有文件
let arr = []

// 默认参数
let projectPath = 'vue'
let frame = 'vue'
let deletePath = ''

// 用户传入的参数
const input = process.argv.slice(2)
// 删除目录只能传一个参数，创建目录则不限，只针对参数做处理【约定】
input.map(async (i) => {
	console.log(i, '<<<<')
	let key = i.split('=')[0].replace('-', '')
	let val = i.split('=')[1]
	switch (key) {
		case 'd':
			if (input.length === 1) {
				deletePath = path.resolve(__dirname, `../../project/${val}/`)
				// 指定删除目录
				await rm(deletePath, deletePath)
			} else {
				console.log('参数有误，请检查是否存在用于删除目录的参数d，并且传参长度为1')
			}
			break
		case 'p':
			projectPath = val
			break
		case 'f':
			frame = val
			break
	}
})

// 创建的目录
let userInputDir = path.resolve(__dirname, `../../project/${projectPath}/`)

/**
 * use: 从指定配置模版进行注入，创建配置文件
 * why:
 * how:
 * params:
 */
// webpack
let webpackBaseTemplate = path.resolve(__dirname, './vueTemplate/build/webpack.base.config.txt');
let webpackDevTemplate = path.resolve(__dirname, './vueTemplate/build/webpack.dev.config.txt');
let webpackProdTemplate = path.resolve(__dirname, './vueTemplate/build/webpack.prod.config.txt');
let webpackClientTemplate = path.resolve(__dirname, './vueTemplate/build/webpack.client.config.txt');
let webpackServerTemplate = path.resolve(__dirname, './vueTemplate/build/webpack.server.config.txt');

// vue
let vueAssetsTemplate = path.resolve(__dirname, './vueTemplate/src/assets/');
let vueEntryTemplate = path.resolve(__dirname, './vueTemplate/src/entry/');
let vuePagesTemplate = path.resolve(__dirname, './vueTemplate/src/pages/');
let vueCompTemplate = path.resolve(__dirname, './vueTemplate/src/components/');
let vueStoreTemplate = path.resolve(__dirname, './vueTemplate/src/store/');

// common
let babelrcTemplate = path.resolve(__dirname, './vueTemplate/.babelrc');
let gitIgnoreTemplate = path.resolve(__dirname, './vueTemplate/.gitignore');
let postcssTemplate = path.resolve(__dirname, './vueTemplate/postcss.config.js');
let packageTemplate = path.resolve(__dirname, './vueTemplate/package.txt');
let readMeTemplate = path.resolve(__dirname, './vueTemplate/README.md');

/**
 * use: 抽离公共拼接路径的代码部分
 * params: 
 * templateName --- 模版名，默认都传真实路径；只有需要拼接根目录下的公共文件才会传入'commonTemplate'
 * fReadName --- 需拼接的初始化目录名
 */
function commonPinThing (templateName, fReadName) {
	// 清空临时数组
	arr = []
	if (templateName !== 'commonTemplate') {
		// 找到模版【目录】内的所有文件，下面将把这些文件copy到初始化目录内
		let result = findAll(templateName)
		result.map(async (r) => {
			// r 是模版中的文件路径
			let pinThing = fReadName.split('src')[0] + r.split('vueTemplate/')[1]	// 结合用户传入创建的目录路径
			if (!fs.existsSync(pinThing)) {
				if (path.extname(pinThing)) {
					// 有后缀的证明是文件；补充检查该文件所在目录，不存在则创建，存在则忽略
					await checkBaseDir(path.dirname(pinThing), path.dirname(pinThing))
					// todo: 1115
					// 把模版中的某个文件写入去初始化项目的路径下
					// 【***特殊情况】选择template目录下带ssr字样的才写入去初始化项目的路径下
					if (r === path.resolve(__dirname, './vueTemplate/src/assets/template/vueSSR.html') && frame === 'vuessr') {
						let temp = path.resolve(userInputDir, 'src/assets/template/vueSSR.html')
						if (fs.existsSync(temp)) {
							fs.copyFileSync(r, temp)
						} else {
							fs.createWriteStream(temp)
							fs.copyFileSync(r, temp)
						}
					} else if (r === path.resolve(__dirname, './vueTemplate/src/assets/template/vue.html') && frame === 'vue') {
						let temp = path.resolve(userInputDir, 'src/assets/template/vue.html')
						if (fs.existsSync(temp)) {
							fs.copyFileSync(r, temp)
						} else {
							fs.createWriteStream(temp)
							fs.copyFileSync(r, temp)
						}
					} else if (r !== path.resolve(__dirname, './vueTemplate/src/assets/template/vue.html') && r !== path.resolve(__dirname, './vueTemplate/src/assets/template/vuessr.html')) {
						// 当前这两种情况上述已经做了处理，只有template这里比较特殊
						fs.copyFileSync(r, pinThing)
					}
				}
			}
		})
	} else {
		fs.copyFileSync(babelrcTemplate, fReadName + babelrcTemplate.split('/pkg/vueTemplate')[1])
		fs.copyFileSync(gitIgnoreTemplate, fReadName + gitIgnoreTemplate.split('/pkg/vueTemplate')[1])
		fs.copyFileSync(postcssTemplate, fReadName + postcssTemplate.split('/pkg/vueTemplate')[1])
		fs.copyFileSync(readMeTemplate, fReadName + readMeTemplate.split('/pkg/vueTemplate')[1])

		// demo package.json
		let fRead = fs.createReadStream(packageTemplate);
		// 小处理：由于【需要额外处理的模版文件】都是txt后缀，所以指定package.txt需要转换json
		let resultPath = fReadName + (packageTemplate.split('/pkg/vueTemplate')[1].replace(/\.txt/ig, '.json'))
		let fWrite = fs.createWriteStream(resultPath);
		let objReadline = readline.createInterface({
				input: fRead,
				terminal: true
		});
	
		objReadline.on('line', (line)=>{
			let temp = ''   // 由于逐行读取不能覆盖原有值，所以用容器装起来
			const devDepReg = /{{devDepParams}}/
			const scriptsReg = /{{scriptsParams}}/
			
			// 替换模板
			if (scriptsReg.test(line)) {
				if (/vuessr/ig.test(frame)) {
					temp = line.replace(scriptsReg, '{"start": "webpack --config ./build/webpack.dev.config.js && webpack-dev-server --config ./build/webpack.dev.config.js --open", "webpack:sc": "webpack --config ./build/webpack.client.config.js", "webpack:ss": "webpack --config ./build/webpack.server.config.js", "webpack:ssr": "webpack --config ./build/webpack.client.config.js && webpack --config ./build/webpack.server.config.js"}')
				} else if (/vue/ig.test(frame)) {
					temp = line.replace(scriptsReg, '{"start": "webpack --config ./build/webpack.dev.config.js && webpack-dev-server --config ./build/webpack.dev.config.js --open", "webpack:dev": "webpack --config ./build/webpack.dev.config.js", "webpack:prod": "webpack --config ./build/webpack.prod.config.js"}')
				}
				fWrite.write(temp + os.EOL); // 下一行
			} else if (devDepReg.test(line)) {
				if (/vuessr/ig.test(frame)) {
					temp = line.replace(devDepReg, '{"vue": "^2.5.17",	"vue-loader": "^15.3.0", "vue-template-compiler": "^2.5.17", "vue-router": "^3.0.1", "vuex": "^3.0.1", "vue-server-renderer": "^2.5.17", "vuex-router-sync": "^5.0.0"}')
				} else if (/vue/ig.test(frame)) {
					temp = line.replace(devDepReg, '{"vue": "^2.5.17",	"vue-loader": "^15.3.0", "vue-template-compiler": "^2.5.17", "vue-router": "^3.0.1", "vuex": "^3.0.1"}')
				} else if (/react/ig.test(frame)) {
					temp = line.replace(devDepReg, '"prop-types": "^15.6.2", "react": "^16.4.2", "react-dom": "^16.4.2",')
				}
				fWrite.write(temp + os.EOL); // 下一行
			} else {
				fWrite.write(line + os.EOL); // 下一行
			}
		});
	
		objReadline.on('close', ()=>{
			console.log(`${userInputDir}项目已生成`)
		})
	}
}

function injectConfig (fReadName, fWriteName, target) {
	if (target === 'webpack') {
		let fRead = fs.createReadStream(fReadName);
		let fWrite = fs.createWriteStream(fWriteName);
		
		let objReadline = readline.createInterface({
				input: fRead,
				terminal: true
		});
	
		objReadline.on('line', (line)=>{
			let temp = ''   // 由于逐行读取不能覆盖原有值，所以用容器装起来
			const entryReg = /{{entryParams}}/
			const vueClientEntryReg = /{{clientEntryParams}}/
			const vueServerEntryReg = /{{serverEntryParams}}/
			const outputReg = /{{outputParams}}/
			const ruleReg = /{{ruleParams}}/
			const templateListReg = /{{templateListParams}}/
			const authorReg = /{{author}}/
			const aliasReg = /{{aliasParams}}/
			const extensionsReg = /{{extensionsParams}}/

			// 默认配置规则
			let rulesDefault = ''
			let templateDefault = ''

			if (/vue/ig.test(frame)) {
				rulesDefault = "[{test: /\.(js)$/, exclude: /node_modules/, loader: 'babel-loader'}, {test: /\.css$/, exclude: /node_modules/,use: ExtractTextPlugin.extract({fallback: 'style-loader',use: [{loader: 'css-loader'}, {loader: 'postcss-loader'}]})}, {test: /\.(png|svg|jpe?g|gif)$/, exclude: /node_modules/, use: [{loader: 'file-loader'}, {loader: 'image-webpack-loader', options: { mozjpeg: {progressive: true,quality: 100},optipng: {enabled: false,},pngquant: {quality: '65-90',speed: 4},gifsicle: {interlaced: false,},webp: {quality: 75}}}]}, {test: /\.(woff|woff2|eot|ttf|otf)$/, exclude: /node_modules/, use: ['file-loader']}, {test: /\.vue$/,loader: 'vue-loader'}]"
				// about postcss => Damn u, postcss2rem！This plugin is not suitable for me to handle postcss, and it cost me too many time to search on Internet just for a stupid thought which is to handle px to rem.
				templateDefault = "new HtmlWebpackPlugin({title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/vue.html'),filename: path.resolve(__dirname, '../dist/vue.html'), minify: true,showErrors: true, chunks: ['common', 'vendors', 'vueEntry']})"
				// 替换模板
				if (entryReg.test(line)) {
					// 入口
					temp = line.replace(entryReg, "{vueEntry: path.resolve(__dirname, '../src/entry/vueEntry.js')}")
				} else if (vueClientEntryReg.test(line)) {
					// 出口
					temp = line.replace(vueClientEntryReg, "{ssrClientEntry: path.resolve(__dirname, '../src/entry/entry-client.js')}")
				}  else if (vueServerEntryReg.test(line)) {
					// 出口
					temp = line.replace(vueServerEntryReg, "{ssrServerEntry: path.resolve(__dirname, '../src/entry/entry-server.js')}")
				}  else if (outputReg.test(line)) {
					// 出口
					temp = line.replace(outputReg, "{filename: '[name].[hash].js',path: path.resolve(__dirname, '../dist/assets/'),publicPath: '/assets/',chunkFilename: '[name].[hash].js'}")
				} else if (ruleReg.test(line)) {
					// 规则
					temp = line.replace(ruleReg, rulesDefault)
				} else if (templateListReg.test(line)) {
					temp = line.replace(templateListReg, templateDefault)
				} else if (authorReg.test(line)) {
					// 模板插件配置
					temp = line.replace(authorReg,  String(new Date().toLocaleString()) + ', written by Leung which use Vue.')
				} else if (aliasReg.test(line)) {
					// todo $用replace会被转义，所以用字符串直接替换掉
					temp = "alias: {'vue$':'vue/dist/vue.js'},"
				} else if (extensionsReg.test(line)) {
					temp = line.replace(extensionsReg, "['.vue']")
				} else {
					temp = line
				}
			} else if (/react/ig.test(frame)) {
				rulesDefault = "[{test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'}, {test: /\.css$/, exclude: /node_modules/,use: ExtractTextPlugin.extract({fallback: 'style-loader',use: [{loader: 'css-loader'}, {loader: 'postcss-loader'}]})}, {test: /\.(png|svg|jpe?g|gif)$/, exclude: /node_modules/, use: [{loader: 'file-loader'}, {loader: 'image-webpack-loader', options: { mozjpeg: {progressive: true,quality: 100},optipng: {enabled: false,},pngquant: {quality: '65-90',speed: 4},gifsicle: {interlaced: false,},webp: {quality: 75}}}]}, {test: /\.(woff|woff2|eot|ttf|otf)$/, exclude: /node_modules/, use: ['file-loader']}, ]"
				// about postcss => Damn u, postcss2rem！This plugin is not suitable for me to handle postcss, and it cost me too many time to search on Internet just for a stupid thought which is to handle px to rem.
				templateDefault = "new HtmlWebpackPlugin({title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/react.html'),filename: path.resolve(__dirname, '../dist/react.html'), minify: true,showErrors: true, chunks: ['common', 'vendors', 'reactEntry']})"
				// 替换模板
				if (entryReg.test(line)) {
					// 入口
					temp = line.replace(entryReg, "{reactEntry: path.resolve(__dirname, '../src/entry/reactEntry.js')}")
				} else if (outputReg.test(line)) {
					// 出口
					temp = line.replace(outputReg, "{filename: '[name].[hash].js',path: path.resolve(__dirname, '../dist/assets/'),publicPath: '/assets/',chunkFilename: '[name].[hash].js'}")
				} else if (ruleReg.test(line)) {
					// 规则
					temp = line.replace(ruleReg, rulesDefault)
				} else if (templateListReg.test(line)) {
					temp = line.replace(templateListReg, templateDefault)
				} else if (authorReg.test(line)) {
					// 模板插件配置
					temp = line.replace(authorReg,  String(new Date().toLocaleString()) + ', written by Leung which use React.')
				} else if (aliasReg.test(line)) {
					temp = line.replace(aliasReg, "{}")
				} else if (extensionsReg.test(line)) {
					temp = line.replace(extensionsReg, "['.js', '.jsx']")
				} else {
					temp = line
				}
			}
			
			fWrite.write(temp + os.EOL); // 下一行
		});
	
		objReadline.on('close', ()=>{
			// // 判断是否生成了模板 => 是则把build/webpack.base.config.js替换掉
			// if (fs.existsSync(fWriteName)) {
			// 	// todo: 1114
			// 	// demo: 测试覆盖，实际项目肯定是不能覆盖给定的文件的
			// 	fs.copyFileSync(fWriteName, path.resolve(__dirname, '../../build/webpack.base.config.js'));
			// }
		})
	} else if (target === 'src/assets') {
		if (/\/src\/assets\/(\w+)/ig.test(fReadName)) {
			commonPinThing(vueAssetsTemplate, fReadName)
		}
	} else if (target === 'src/xxx') {
		if (/\/src\/(\w+)/ig.test(fReadName)) {
			let fileStat = fs.statSync(fReadName)
			if (fs.statSync(fReadName)) {
				if (fileStat.isDirectory()) {
					// 只允许传入的参数是目录
					fReadName.replace(/\/src\/(\w+)/, function () {
						const name = arguments[1]
						switch (name) {
							case 'components':
								commonPinThing(vueCompTemplate, fReadName)
								break
							case 'pages':
								commonPinThing(vuePagesTemplate, fReadName)
								break
							case 'entry':
								commonPinThing(vueEntryTemplate, fReadName)
								break
							case 'store':
								commonPinThing(vueStoreTemplate, fReadName)
								break
							case 'router':
								break
							case 'config':
								break
						}
					})
				}
			}
		}
	} else if (target === 'src/') {
		// 将common直接copy过去
		commonPinThing('commonTemplate', fReadName)
	}
}

/**
 * use: 用于判断上一级目录是否存在，并做相关操作
 * @param {*} pathWay 当前目录
 * @param {*} firstTimePath 第一次传入的目录
 * @desc dir = /a/b/c/d，有可能a,b,c,d都不存在，如果按理走回调，最多创建到a，b,c,c都创建不了 => 特别是应用在遍历这种异步环境 【重构于0813】
 */
async function checkBaseDir (pathWay, firstTimePath) {
	const lastPath = path.dirname(pathWay)
	if (!fs.existsSync(lastPath)) {
		// console.log(`1: ${lastPath}不存在上级目录，继续回调，传入${lastPath}, ${firstTimePath}`)
		await checkBaseDir(lastPath, firstTimePath)
	}	else {
		// console.log(`2.1 ${lastPath}存在上级目录，创建${pathWay}, ${lastPath}, ${firstTimePath}`)
		!fs.existsSync(pathWay) && fs.mkdirSync(pathWay)
		// console.log(`2.2: 判断最初传入的${firstTimePath}是否存在`)
		if (!fs.existsSync(firstTimePath)) {
			// console.log(`2.3: 不存在，继续回调，${firstTimePath}，${firstTimePath}传入`)
			await checkBaseDir(firstTimePath, firstTimePath)
		} else {
			// console.log(`最初传入的目录已经创建完.`)
			return Promise.resolve()
		}
	}
}

/**
 * use: 遍历查找目录下的文件
 * warn: 每次调用之前都要清掉全局数组
 * why:
 * how:
 * params:
 * return: 返回由该目录下所有文件组成的数组
 * desc: let arr = []
 */
function findAll (dir) {
	const dirStat = fs.statSync(dir)
	if (!fs.existsSync(dir)) {
		console.log('不存在该目录')
		return
	}
	if (!fs.statSync(dir)) {
		console.log(`${dir}该目录内并没有任何文件`)
		return
	}
	if (dirStat.isDirectory()) {
		const fileList = fs.readdirSync(dir)
		// 排除以.开头的隐藏文件
		fileList.map((file) => {
			if (!/^\./ig.test(file)) {
				file = path.resolve(__dirname, `${dir}/${file}`)	// 拼接好文件的完整路径
				const fileStat = fs.statSync(file)
				if (fileStat.isDirectory()) {
					// 递归
					findAll(file)
				} else {
					arr.push(file)
				}
			}
		})
	} else {
	}
	return arr
}

/**
 * use：实现创建某个目录下的所有文件
 * why：
 * how：
 * params：-p 创建vue示例目录 -- mkfile() -t 在vue示例目录创建配置文件 -- injectConfig()
 */
async function mkfile (userInputDir) {
	if (!!deletePath) {
		// 变量deletePath有值，证明用户是删除操作
		return
	} else {
		if (fs.existsSync(userInputDir)) {
			// console.log('有就不会创建啦，傻的咩')
			// 存在则走正常逻辑
			// 判断传入的参数是文件还是目录
			let fileStat = fs.statSync(userInputDir)
			if (fileStat.isDirectory()) {
				// 文件状态判断为目录
				let readyToDir = [path.resolve(__dirname, `${userInputDir}/build`), path.resolve(__dirname, `${userInputDir}/src`), path.resolve(__dirname, `${userInputDir}/src/assets`), path.resolve(__dirname, `${userInputDir}/src/assets/style`), path.resolve(__dirname, `${userInputDir}/src/assets/images`), path.resolve(__dirname, `${userInputDir}/src/assets/scripts`), path.resolve(__dirname, `${userInputDir}/src/assets/template`), path.resolve(__dirname, `${userInputDir}/src/components`), path.resolve(__dirname, `${userInputDir}/src/entry`), path.resolve(__dirname, `${userInputDir}/src/store`), path.resolve(__dirname, `${userInputDir}/src/router`), path.resolve(__dirname, `${userInputDir}/src/config`), path.resolve(__dirname, `${userInputDir}/src/pages`), userInputDir]
				readyToDir.forEach(async (itemDir) => {
					if (!fs.existsSync(itemDir)) {
						await checkBaseDir(itemDir, itemDir)	// 检查并最终创建目录后，递归
						if (/\/build/ig.test(itemDir)) {
							// 检查遍历项是否为build/目录，命中则调用注入函数
							// 还要检查是否为ssr项目
							injectConfig(webpackBaseTemplate, path.resolve(__dirname, `${itemDir}/webpack.base.config.js`), 'webpack')
							if (/ssr/ig.test(frame)) {
								injectConfig(webpackClientTemplate, path.resolve(__dirname, `${itemDir}/webpack.client.config.js`), 'webpack')
								injectConfig(webpackServerTemplate, path.resolve(__dirname, `${itemDir}/webpack.server.config.js`), 'webpack')
							} else {
								injectConfig(webpackDevTemplate, path.resolve(__dirname, `${itemDir}/webpack.dev.config.js`), 'webpack')
								injectConfig(webpackProdTemplate, path.resolve(__dirname, `${itemDir}/webpack.prod.config.js`), 'webpack')
							}
						} else if (/\/src\/assets(\/\w+)*/ig.test(itemDir)) {
							// 过滤出 src/assets 目录，单独处理
							injectConfig(itemDir, '', 'src/assets')
						} else if (/\/src\/\w+/ig.test(itemDir)) {
							// 过滤出除了src/assets 目录外的目录，例如: src/xxx 目录
							injectConfig(itemDir, '', 'src/xxx')
						}
					} else if (fs.existsSync(userInputDir)) {
						injectConfig(itemDir, '', 'src/')
					}			
				})
			} else {
					// 文件状态判断为文件
					console.log('>>>>>这是文件啊')
			}
		} else {
			await checkBaseDir(path.dirname(userInputDir), userInputDir)	// 检查并最终创建目录后，递归
			mkfile(userInputDir)
		}
	}
}

// execute
mkfile(userInputDir)