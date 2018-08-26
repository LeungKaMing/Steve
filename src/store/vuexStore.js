import Vue from "vue";
import Vuex from 'vuex'

import intro from '../store/intro/module.js'

Vue.use(Vuex)

const store =  new Vuex.Store({
	state: {
		rootCount: 0
	},
	modules: {
		intro: intro
	}
})

export default store