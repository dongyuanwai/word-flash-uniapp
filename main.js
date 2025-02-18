import { createSSRApp } from 'vue'
import App from './App'
import pinia from './store'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app
  }
}
// #endif