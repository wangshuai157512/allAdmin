import config from '@/utils/config'

const api = {
  getUserList : config.BaseUrl + '/api/youxuepei_admin/getUserList',
  getFormUserList : config.BaseUrl + '/api/youxuepei_admin/getFormUserList',
  delUser : config.BaseUrl + '/api/youxuepei_admin/delUser',
  getChannel : config.BaseUrl + '/api/youxuepei_admin/getChannel',
  addChannel : config.BaseUrl + '/api/youxuepei_admin/addChannel',
  delChannel : config.BaseUrl + '/api/youxuepei_admin/delChannel'
}

export default api
