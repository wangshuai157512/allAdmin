import request from '@/utils/request'
import config from '@/utils/config'

export function getShareList(params) {
  return request({
    url: config.BaseUrl + '/api/app_share/get',
    method: 'post',
    data: params
  })
}

export function signState(params) {
  return request({
    url: config.BaseUrl + '/api/app_share/sign',
    method: 'post',
    data: params
  })
}
