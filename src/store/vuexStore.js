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
		}
	},
	getters: {
		get1stJob: state => state.list.filter(item => item === '2016-8'),
		getLanguage: state => (language) => state.list2.filter(item => item === language)
	}
})