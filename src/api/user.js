import request from '@/utils/request'
import config from '@/utils/config'

export function getUserList(params) {
  return request({
    url: config.BaseUrl + '/api/app_login/teacherGet',
    method: 'post',
    data: params
  })
}

export function getCouponUserList(params) {
  return request({
    url: config.BaseUrl + '/api/app_login/couponUserGet',
    method: 'post',
    data: params
  })
}

export function getItUserList(params) {
  return request({
    url: config.BaseUrl + `/api/it_admin/userList?page=${params.page}`,
    method: 'get'
  })
}
// 导出看课记录
export function getExportCourse(params) {
  return request({
    url: config.BaseUrl + `/api/it_admin/getExportLookCourseList?page=${params.page}&startTime=${params.startTime}&endTime=${params.endTime}`,
    method: 'get'
  })
}
// 导出分享记录
export function getExportShareList(params) {
  return request({
    url: config.BaseUrl + `/api/it_admin/getExportShareList?page=${params.page}&startTime=${params.startTime}&endTime=${params.endTime}`,
    method: 'get'
  })
}
