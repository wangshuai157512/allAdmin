import Vue from 'vue'

//头部
import headerGroup from '../package/headerGroup'
//表格
import hcTable from '../package/hcTable'
//diglog
import hcDialog from '../package/hcDialog'


const components = [
  headerGroup,
  hcTable,
  hcDialog
]

const install = (Vue) => {
  components.forEach((component) => {
    Vue.component(component.name,component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install
