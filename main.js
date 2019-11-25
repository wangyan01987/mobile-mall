import Vue from 'vue'
import App from './App'
import store from './store'  
import {showModal} from './common/untils.js'
 

Vue.config.productionTip = false
Vue.prototype.$store = store 
Vue.prototype.$showModal = showModal;
App.mpType = 'app';

const app = new Vue({
    ...App
})
app.$mount()
