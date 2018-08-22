import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		count: 0,
		name: 'leung',
		age: 26
	},
	mutations: {
		increment (state) {
			state.count++
			state.age++
		},
		decrement (state) {
			state.count--
			state.age--
		},
		fullName (state) {
			state.name = 'leungkaming'
		},
		shortName (state) {
			state.name = 'leung'
		}
	}
})