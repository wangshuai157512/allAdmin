<template>
  <div class="hc-tag">
    <div class="tag-item" v-for="(item,index) in tagsList" :class="{'active':isActive(item.path)}" :key="index">
      <router-link :to="item.path">{{item.title}}</router-link>
      <span>
        <i class="el-icon-close"></i>
      </span>
    </div>
  </div>

</template>

<script>
    import bus from '../../utils/bus'
    export default {
      name: "index",
      data () {
        return {
          tagsList : []
        }
      },
      methods : {
        isActive (path) {
          return path === this.$route.fullPath;
        },
        goPage (path) {
          this.$router.push({
            path
          })
        },
        setTags (route) {
          console.log(route)
          const isExist = this.tagsList.some(item => {
            return item.path === route.fullPath;
          })
          console.log(isExist)
          if (!isExist) {
            if(this.tagsList.length >= 8){
              this.tagsList.shift();
            }
            this.tagsList.push({
              title: route.meta.title,
              path: route.fullPath,
              name: route.matched[1].components.default.name
            })
          }
          console.log(this.tagsList)
          bus.$emit('tags', this.tagsList);
        }
      },
      created () {
        this.setTags(this.$route)
      },
      watch:{
        $route(newValue, oldValue){
          this.setTags(newValue);
        }
      },
    }
</script>

<style scoped lang="scss">
  .hc-tag {
    background-color: #fff;
    box-sizing: border-box;
  }
  .tag-item {
    padding: 0 5px 0 12px;
    background-color: #fff;
    display: inline-block;
    margin: 3px 5px 2px 3px;
    border-radius: 3px;
    color: #666;
    border: 1px solid #e9eaec;
    .el-icon-close {
      color: #666;
    }
  }

  .tag-item.active {
    background-color: #409eff;
    color: #fff;
    .el-icon-close {
      color: #fff;
    }
  }

  .active {

  }

</style>
