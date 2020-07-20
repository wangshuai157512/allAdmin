<template>
    <div>
      <el-table
        :data="tableData"
        border
        fit
        highlight-current-row
      >
        <template v-for="col in tableCols">
          <slot v-if="col.slot" :name="col.slot"></slot>
          <el-table-column
            v-else
            :align="col.align || 'left'"
            :width="col.width || ''"
            :label="col.label"
          >
            <template slot-scope="scope">
              <div v-if="col.type === 'image'">
                <img :src="scope.row[col.props]" class="img_head" />
              </div>
              <div v-else-if="col.type === 'a'">
                <a
                  :href="scope.row[col.props]"
                  style="color: dodgerblue;"
                  target="_blank"
                >
                  {{scope.row[col.props]}}
                </a>
              </div>
              <div v-else-if="col.type === 'tag'">
                <el-tag
                  :type="col.tagList[scope.row[col.props]].type"
                >
                  {{col.tagList[scope.row[col.props]].name}}
                </el-tag>
              </div>
              <div v-else-if="col.type === 'switch'">
                <el-switch
                  v-model="scope.row[col.props]"
                  active-color="#13ce66"
                  :active-value="col.activeValue"
                  :inactive-value="col.inactiveValue"
                  @change="changeSwitch(scope.row.id,scope.$index)"
                ></el-switch>
              </div>
              <div v-else>
                <span>{{ scope.row[col.props]}}</span>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="pagination-style" v-if="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="paginationOption.total"
          :current-page.sync="paginationOption.page"
          :page-size="paginationOption.limit"
          @current-change="handPaginationData"
        >
        </el-pagination>
      </div>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    export default {
      name: "hcTable",
      props : {
        //表格数据
        tableData : {
          type : Array,
          default : []
        },
        //表头
        tableCols : {
          type : Array,
          default : []
        },
        //是否需要分页
        pagination : {
          type : Boolean,
          default : true,
        },
        //分页属性
        paginationOption : {
          type : Object,
          default : () => {
            return {
              page : 1,
              total : 0,
              limit : 20
            }
          }
        },
        dialogOption : {
          type : Object
        }
      },
      components : {
        Pagination
      },
      methods : {
        handPaginationData (page) {
          this.$emit('handPaginationData' , { page })
        },
        changeSwitch (id,index) {
          this.$emit('handChangeSwitch', { id, index })
        }
      }
    }
</script>

<style lang="scss" scoped>
  .pagination-style {
    margin-top: 20px;
  }
  .img_head {
    width: 50px;
    height: 50px;
  }
</style>
