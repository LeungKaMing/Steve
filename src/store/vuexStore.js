import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		count: 0,
		name: 'leung',
		age: 26,
		list: ['2016-8', '2017-8', '2018-8'],
		list2: ['python', 'javascript', 'php'],
	},
	mutations: {
		increment (state, num) {
			if (!!num) {
				state.age++
			} else {
				state.count++
			}
		},
		decrement (state, num) {
			if (!!num) {
				state.age--
			} else {
				state.count--
			}
		},
		fullName (state) {
			state.name = 'leungkaming'
		},
		shortName (state) {
			state.name = 'leung'
		},
		removeItem (state, index) {
			state.list.splice(index, 1)
		},
		insertItem (state, index, item) {
			state.list.splice(index, 0, item)
		}
	},
	getters: {
		get1stJob: state => state.list.filter(item => item === '2016-8'),
		getLanguage: state => (language) => state.list2.filter(item => item === language)
	}
})