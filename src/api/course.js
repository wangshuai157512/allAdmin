import request from '@/utils/request'
import config from '@/utils/config'

export function getList(params) {
  return request({
    url: config.BaseUrl + '/api/app_course/get',
    method: 'post',
    data: params
  })
}

export function delCourse(courseId) {
  return request({
    url: config.BaseUrl + '/api/app_course/del',
    method: 'post',
    data: { courseId }
  })
}

export function addCourse(newdata) {
  return request({
    url: config.BaseUrl + '/api/app_course/add',
    method: 'post',
    data: newdata
  })
}

export function lookCourse(id) {
  return request({
    url: config.BaseUrl + '/api/app_course/look',
    method: 'post',
    data: {
      id
    }
  })
}

export function editCourse(id, newdata) {
  newdata.id = id
  return request({
    url: config.BaseUrl + '/api/app_course/edit',
    method: 'post',
    data: newdata
  })
}

// 教师资格小程序课程查询
export function getTeacherList(params) {
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/get',
    method: 'post',
    data: params
  })
}

export function selectTagCourse() {
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/selectTagCourse',
    method: 'get'
  })
}
export function addTagCourse(title) {
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/addTagCourse',
    method: 'post',
    data: title
  })
}
export function deleteTagCourse(id) {
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/deleteTagCourse',
    method: 'post',
    data: id
  })
}

export function lookTeacherCourse(id) {
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/look',
    method: 'post',
    data: {
      id
    }
  })
}

export function addTeacherCourse(newdata) {
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/add',
    method: 'post',
    data: newdata
  })
}

export function editTeacherCourse(id, newdata) {
  newdata.id = id
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/edit',
    method: 'post',
    data: newdata
  })
}
export function uploadFile(params) {
  console.log(config)
  return request({
    url: config.BaseUrl + `/api/upload/uploadFile`,
    method: 'post',
    data: params
  })
}
// uploadFile : params => {
//   return request({
//     url: config.BaseUrl + `/api/upload/uploadFile`,
//     method: 'post',
//     data: params
//   })
// },

export function editTeacherCourseUrl(id, newdata) {
  newdata.id = id
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/editUploadphoto',
    method: 'post',
    data: newdata
  })
}

export function delTeacherCourse(id) {
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/del',
    method: 'post',
    data: { id }
  })
}
export function showTeacherCourse(id,isShow) {
  return request({
    url: config.BaseUrl + '/api/app_teacherCourse/showTeacherCourse',
    method: 'post',
    data: { id, isShow}
  })
}

// 阿波罗小程序课程包查询
export function getCouponList(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/get',
    method: 'post',
    data: params
  })
}

// 阿波罗小程序课程包启用/停用
export function enableCoupon(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/enable',
    method: 'post',
    data: params
  })
}

// 阿波罗小程序课程查询
export function getCoupon(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/allDetail',
    method: 'post',
    data: params
  })
}

// 阿波罗小程序课程包移除课程
export function outCourse(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/outCourse',
    method: 'post',
    data: params
  })
}

// 阿波罗小程序课程包关联课程
export function relaseCourse(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/relaseCourse',
    method: 'post',
    data: params
  })
}

// 阿波罗小程序课程新增
export function addApolloCourse(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/addCourse',
    method: 'post',
    data: params
  })
}

// 课程包新增
export function addCourseList(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/add',
    method: 'post',
    data: params
  })
}

// 课程包查询
export function getbar(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/getbar',
    method: 'post',
    data: params
  })
}

// 课程包编辑
export function editCourseList(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/edit',
    method: 'post',
    data: params
  })
}

// 课程编辑
export function editCourseCoupon(params) {
  return request({
    url: config.BaseUrl + '/api/app_couponCourse/editCourse',
    method: 'post',
    data: params
  })
}

//it教育课程列表
export function getItcourseList(params) {
  return request({
    url: config.BaseUrl + `/api/it_admin/courseList?page=${params.page}`,
    method: 'get',
    data: params
  })
}
