import request from '@/utils/request'
import config from '@/utils/config'

export function getOrderList(params) {
  return request({
    url: config.BaseUrl + '/api/app_order/getAdmin',
    method: 'post',
    data: params
  })
}

export function signOrderState(params) {
  return request({
    url: config.BaseUrl + '/api/app_order/sign',
    method: 'post',
    data: params
  })
}

// 获取成考辅导订单
export function getCouponOrderList(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponOrder/getOrder',
    method: 'post',
    data: params
  })
}
