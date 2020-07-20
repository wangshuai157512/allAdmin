import request from '@/utils/request'
import config from '@/utils/config'

export function getUserList(params) {
  return request({
    url: config.BaseUrl + '/api/app_login/look',
    method: 'post',
    data: params
  })
}
