/**
 * 导出excel类
 * @param options
 */
class exportExcel {
  constructor () {
    this.tHeader = []
    this.tKey = []
    this.exportList = []
    this.excelName = '表格'
  }
  exportExcelData = (options = {}) => {
    require.ensure([], () => {
      const { tHeader, tKey, exportList,excelName  } =  options
      const { export_json_to_excel } = require('../vendor/Export2Excel');    //引入文件
      const data = this.formatJson(tKey, exportList);
      export_json_to_excel(tHeader, data, excelName);
    })
  }
  formatJson = (filterVal,jsonData) => {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }
}

export default new exportExcel()
