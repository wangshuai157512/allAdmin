import headerGroup from './src/headerGroup'

headerGroup.install = Vue => {
  Vue.component(headerGroup.name,headerGroup)
}

export default headerGroup
