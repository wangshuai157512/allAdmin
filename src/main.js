import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import packageIndex from './packageIndex'
import exportExcel from '../src/utils/exportExcel'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })
Vue.use(packageIndex)

import upload from '@/utils/upload'

Vue.config.productionTip = false
Vue.prototype.$exportExcel = exportExcel.exportExcelData
Vue.prototype.$uploadFile = upload.uploadImg

// router.beforeEach((to,from,next) => {
//   console.log(to,from)
//   if (to.query.name === 'lan') {
//     next('/xc/user')
//     return
//   }
//   next()
// })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
