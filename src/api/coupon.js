import request from '@/utils/request'
import config from '@/utils/config'

// 阿波罗小程序用户优惠券查看
export function getCouponList(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponOrder/get',
    method: 'post',
    data: params
  })
}

// 阿波罗小程序优惠券列表查看
export function selectCouponList(params) {
  return request({
    url: config.BaseUrl + '/api/app_coupon/get',
    method: 'post',
    data: params
  })
}
