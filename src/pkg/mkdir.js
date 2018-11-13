const fs = require('fs')
const path = require('path')
const readline = require('readline');
const os = require('os');

const rm = require('./rm')

// 临时数组，用于存放某个目录下的所有文件
let arr = []

/**
 * use: 从指定配置模版进行注入，创建配置文件
 * why:
 * how:
 * params:
 */
// webpack
let webpackBaseTemplate = path.resolve(__dirname, './buildToolsTemplate/webpack.base.template.txt');
let webpackDevTemplate = path.resolve(__dirname, './buildToolsTemplate/webpack.dev.template.txt');
let webpackProdTemplate = path.resolve(__dirname, './buildToolsTemplate/webpack.prod.template.txt');
let webpackClientTemplate = path.resolve(__dirname, './buildToolsTemplate/webpack.client.template.txt');
let webpackServerTemplate = path.resolve(__dirname, './buildToolsTemplate/webpack.server.template.txt');

// vue
let vueEntryTemplate = path.resolve(__dirname, './vueTemplate/entry/');
let vuePagesTemplate = path.resolve(__dirname, './vueTemplate/pages/App.vue');
let vueStoreTemplate = path.resolve(__dirname, './vueTemplate/store/');
let vueTemplate = path.resolve(__dirname, './vueTemplate/template/vue.html');

// rootdir
let rootDir = path.resolve(__dirname, '../../project/vue/')

function injectConfig (fReadName, fWriteName, target) {
	if (target === 'webpackBaseTemplate') {
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
			const templateListReg = /{{templateListParams}}/
			const authorReg = /{{author}}/
	
			// 默认配置规则
			const rulesDefault = "[{test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'}, {test: /\.css$/, exclude: /node_modules/,use: ExtractTextPlugin.extract({fallback: 'style-loader',use: [{loader: 'css-loader'}, {loader: 'postcss-loader'}]})}, {test: /\.(png|svg|jpe?g|gif)$/, exclude: /node_modules/, use: [{loader: 'file-loader'}, {loader: 'image-webpack-loader', options: { mozjpeg: {progressive: true,quality: 100},optipng: {enabled: false,},pngquant: {quality: '65-90',speed: 4},gifsicle: {interlaced: false,},webp: {quality: 75}}}]}, {test: /\.(woff|woff2|eot|ttf|otf)$/, exclude: /node_modules/, use: ['file-loader']}, {test: /\.vue$/,loader: 'vue-loader'}]"
	
			// 默认模板插件参数
			// about postcss => Damn u, postcss2rem！This plugin is not suitable for me to handle postcss, and it cost me too many time to search on Internet just for a stupid thought which is to handle px to rem.
			const templateDefault = "new HtmlWebpackPlugin({title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/index.html'),filename: path.resolve(__dirname, '../dist/index.html'), minify: true,showErrors: true,  chunks: ['common', 'vendors', 'app']}), new HtmlWebpackPlugin({title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/vue.html'),filename: path.resolve(__dirname, '../dist/vue.html'), minify: true,showErrors: true, chunks: ['common', 'vendors', 'vueEntry']}), new HtmlWebpackPlugin({title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/react.html'),filename: path.resolve(__dirname, '../dist/react.html'), minify: true,showErrors: true, chunks: ['common', 'vendors', 'reactEntry']})"
			
			// 替换模板
			if (entryReg.test(line)) {
				// 入口
				temp = line.replace(entryReg, "{app: path.resolve(__dirname, '../src/entry/index.js'), vueEntry: path.resolve(__dirname, '../src/entry/vueEntry.js'), reactEntry: path.resolve(__dirname, '../src/entry/reactEntry.js')}")
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
				// demo: 测试覆盖，实际项目肯定是不能覆盖给定的文件的
				fs.copyFileSync(fWriteName, path.resolve(__dirname, '../../build/webpack.base.config.js'));
			}
		})
	} else if (target === 'src/assets') {
		if (/\/src\/assets\/(\w+)/g.test(fReadName)) {
			let fileStat = fs.statSync(fReadName)
			if (fs.statSync(fReadName)) {
				if (fileStat.isDirectory()) {
					// 只允许传入的参数是目录
					fReadName.replace(/\/src\/assets(\/\w+)+/g, function () {
						switch (arguments[1].split('/')[1]) {
							case 'style':
								// console.log('style')
								break
							case 'images':
								// console.log('images')
								break
							case 'scripts':
								// console.log('scripts')
								break
							case 'template':
								// console.log(path.resolve(__dirname, `${fReadName}/vue.html`))
								fs.copyFileSync(vueTemplate, path.resolve(__dirname, `${fReadName}/vue.html`))
								break
						}
					})
				}
			}
		}
	} else if (target === 'src/xxx') {
		if (/\/src\/(\w+)/g.test(fReadName)) {
			let fileStat = fs.statSync(fReadName)
			if (fs.statSync(fReadName)) {
				if (fileStat.isDirectory()) {
					// 只允许传入的参数是目录
					fReadName.replace(/\/src\/(\w+)/, function () {
						// console.log(arguments[1])
						const name = arguments[1]
						switch (name) {
							case 'components':
								console.log('components')
								break
							case 'entry':
								console.log('entry')
								// fs.copyFileSync(vueEntryTemplate, path.resolve(__dirname, `${fReadName}/vueEntry.js`))
								// 清空临时数组
								arr = []
								let result2 = findAll(vueEntryTemplate)
								result2.map((r) => {
									// console.log(`${r} ----- ${r.split('vueTemplate/')[1]} ----- ${path.dirname(r.split('vueTemplate/')[1])} ----- ${fReadName} ----- >>>>>>r`)
									let pinThing2 = fReadName.split(name)[0] + r.split('vueTemplate/')[1]	// 初始化项目需要拼接好的路径
									if (!fs.existsSync(pinThing2)) {
										if (path.extname(pinThing2)) {
											// 有后缀的证明是文件
											checkBaseDir(path.dirname(pinThing2), path.dirname(pinThing2))
											// 把模版文件写入去初始化项目的路径下
											fs.copyFileSync(r, pinThing2)
										}
									} else {
										console.log('存在pinThing2')
									}
								})
								break
							case 'store':
								// 清空临时数组
								arr = []
								let result3 = findAll(vueStoreTemplate)
								result3.map((r) => {
									// console.log(`${r} ----- ${r.split('vueTemplate/')[1]} ----- ${path.dirname(r.split('vueTemplate/')[1])} ----- ${fReadName} ----- >>>>>>r`)
									let pinThing = fReadName.split(name)[0] + r.split('vueTemplate/')[1]	// 初始化项目需要拼接好的路径
									if (!fs.existsSync(pinThing)) {
										if (path.extname(pinThing)) {
											// 有后缀的证明是文件
											checkBaseDir(path.dirname(pinThing), path.dirname(pinThing))
											// 把模版文件写入去初始化项目的路径下
											fs.copyFileSync(r, pinThing)
										}
									} else {
										console.log('存在pinThing')
									}
								})
								break
							case 'router':
								console.log('router')
								break
							case 'config':
								console.log('config')
								break
						}
					})
				}
			}
		}
		// console.log(fReadName, 'no param 3', target, '<<<<<<<<')
	}
}

/**
 * use: 用于判断上一级目录是否存在，并做相关操作
 * @param {*} pathWay 当前目录
 * @param {*} firstTimePath 第一次传入的目录
 * @desc dir = /a/b/c/d，有可能a,b,c,d都不存在，如果按理走回调，最多创建到a，b,c,c都创建不了 => 特别是应用在遍历这种异步环境 【重构于0813】
 */
function checkBaseDir (pathWay, firstTimePath) {
	const lastPath = path.dirname(pathWay)
	if (!fs.existsSync(lastPath)) {
		// console.log(`1: ${lastPath}不存在上级目录，继续回调，传入${lastPath}, ${firstTimePath}`)
		checkBaseDir(lastPath, firstTimePath)
	}	else {
		// console.log(`2.1 ${lastPath}存在上级目录，创建${pathWay}, ${lastPath}, ${firstTimePath}`)
		!fs.existsSync(pathWay) && fs.mkdirSync(pathWay)
		// console.log(`2.2: 判断最初传入的${firstTimePath}是否存在`)
		if (!fs.existsSync(firstTimePath)) {
			// console.log(`2.3: 不存在，继续回调，${firstTimePath}，${firstTimePath}传入`)
			checkBaseDir(firstTimePath, firstTimePath)
		} else {
			// console.log(`最初传入的目录已经创建完.`)
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
			if (!/^\./g.test(file)) {
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
								checkBaseDir(itemDir, itemDir)	// 检查并最终创建目录后，递归
								if (itemDir === path.resolve(__dirname, `${rootDir}/build`)) {
									// 检查遍历项是否为build/目录，命中则调用注入函数
									injectConfig(webpackBaseTemplate, path.resolve(__dirname, `${itemDir}/webpack.base.config.js`), 'webpackBaseTemplate')
								} else if (/\/src\/assets(\/\w+)*/g.test(itemDir)) {
									// 过滤出 src/assets 目录，单独处理
									injectConfig(itemDir, '', 'src/assets')
								} else if (/\/src\/\w+/g.test(itemDir)) {
									// 过滤出除了src/assets 目录外的目录，例如: src/xxx 目录
									injectConfig(itemDir, '', 'src/xxx')
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
		checkBaseDir(path.dirname(rootDir), rootDir)	// 检查并最终创建目录后，递归
		mkfile(rootDir)
	}
}

// execute
mkfile(rootDir)
// console.log(findAll(path.resolve(__dirname, './vueTemplate/store/')))