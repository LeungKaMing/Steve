import Vue from "vue";
import Vuex from 'vuex'
import mutationTypes from './mutaion-types.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		count: 0,
		name: 'leung',
		age: 26,
		list: ['2016-8', '2017-8', '2018-8'],
		list2: ['python', 'javascript', 'php'],
		ajaxFlag: false,
		delayText: 'hello',
		promiseText: false
	},
	mutations: {
		[mutationTypes.INCREMENT] (state, payload) {
			if (!!payload) {
				state.age = state.age + payload.num
			} else {
				state.count++
			}
		},
		[mutationTypes.DECREMENT] (state, payload) {
			if (!!payload) {
				state.age = state.age - payload.num
			} else {
				state.count--
			}
		},
		[mutationTypes.FULLNAME] (state) {
			state.name = 'leungkaming'
		},
		[mutationTypes.SHORTNAME] (state) {
			state.name = 'leung'
		},
		[mutationTypes.REMOVEITEM] (state, index) {
			state.list.splice(index, 1)
		},
		[mutationTypes.INSERTITEM] (state, index, item) {
			state.list.splice(index, 0, item)
		},
		[mutationTypes.FAKEAJAX] (state) {
			state.ajaxFlag = true
		},
		[mutationTypes.DELAYTEXT] (state) {
			state.delayText = 'world'
		},
		[mutationTypes.PROMISETEXT] (state) {
			state.promiseText = 'yes!of course!'
		}
	},
	getters: {
		get1stJob: state => state.list.filter(item => item === '2016-8'),
		getLanguage: state => (language) => state.list2.filter(item => item === language)
	},
	actions: {
		/**
		 * 1. Action 函数接受一个【与 store 实例具有相同方法和属性的 context 对象】，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters ==> 等同于store.state, store.getters, store.commit
		 * 2. 但context并不是store实例！！！
		 */
		fakeAjax (context, data) {
			setTimeout(() => {
				console.log('ajax发起成功: ', data.msg)
				context.commit('fakeAjax')
			}, 1000)
		},
		delayText (context) {
			setTimeout(() => {
				console.log('异步文案发起成功')
				context.commit('delayText')
			}, 1000)
		},
		async combinePromise (context) {
			await promiseFunc()
			context.commit('promiseText')
		},
		promiseFunc (context) {
			return new Promise ((resolve, reject) => {
				setTimeout(() => {
					console.log('what\'s new in state: ', {...context.state})
					resolve()
				}, 1000)
			})
		}
	}
})