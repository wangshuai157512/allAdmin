<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" v-if="route.name === projectState" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { getProjectState } from '@/utils/auth'

export default {
  components: { SidebarItem },
  data() {
    return {
      projectState: '职业教育'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      console.log(this.$router)
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    if (getProjectState() || typeof getProjectState() === 'number') {
      let state = getProjectState()
      if (state === '0') {
        this.$data.projectState = '职业教育'
      } else if (state === '1') {
        this.$data.projectState = '成考辅导'
      } else if (state === '2') {
        this.$data.projectState = 'it教育'
      } else if (state === '3') {
        this.$data.projectState = '非学历'
      } else if (state === '4') {
        this.$data.projectState = '职业培训课'
      } else if (state === '5') {
        this.$data.projectState = '职业培训表单管理'
      }
      // this.$data.projectState = getProjectState() === '1' ? '成考辅导' : ''
      return false
    }
    // this.$data.projectState = this.$store.getters.projectState === 1 ? '成考辅导' : '职业教育'
    if (this.$data.projectState === 1) {
      this.$data.projectState = '成考辅导'
    } else if (this.$data.projectState === 0) {
      this.$data.projectState = '职业教育'
    } else if (this.$data.projectState === 2) {
      this.$data.projectState = 'it教育'
    } else if (this.$data.projectState === 3) {
      this.$data.projectState = '非学历'
    } else if (this.$data.projectState === 4) {
      this.$data.projectState = '职业培训课'
    } else if (this.$data.projectState === 5) {
      this.$data.projectState = '职业培训表单管理'
    }
  }
}
</script>
