import request from '@/utils/request'
import config from '@/utils/config'
const api = {
  addCategory : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/addCategory`,
      method: 'post',
      data: params
    })
  },
  getCategory : (params) => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getCategory`,
      method: 'get',
      data: params
    })
  },
  updateCategory : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/updateCategory`,
      method: 'post',
      data: params
    })
  },
  uploadFile : params => {
    return request({
      url: config.BaseUrl + `/api/upload/uploadFile`,
      method: 'post',
      data: params
    })
  },
  getCourseDetail : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getCourseDetail?id=${params.id}`,
      method: 'get',
      data: params
    })
  },
  updateCourse : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/updateCourse`,
      method: 'post',
      data: params
    })
  },
  addCourse : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/addCourse`,
      method: 'post',
      data: params
    })
  },
  addBanner : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/addBanner`,
      method: 'post',
      data: params
    })
  },
  getCourse : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getCourse`,
      method: 'get',
      data: params
    })
  },
  getBanner : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getBanner`,
      method: 'get',
      data: params
    })
  },
  editBanner : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/editBanner`,
      method: 'post',
      data: params
    })
  },
  getBannerDetail : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getBannerDetail?id=${params.id}`,
      method: 'get',
      data: params
    })
  },
  delBanner : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/delBanner`,
      method: 'post',
      data: params
    })
  },
  bannerShowOrhide : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/bannerShowOrhide`,
      method: 'post',
      data: params
    })
  },
  getShareList : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getShare?id=${params.id}`,
      method: 'get',
      data: params
    })
  },
  delUser : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/delUser`,
      method: 'post',
      data: params
    })
  },
  delCourse : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/delCourse`,
      method: 'post',
      data: params
    })
  },
  delCategory : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/delCategory`,
      method: 'post',
      data: params
    })
  },
  getComments : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getComments?id=${params.id}`,
      method: 'get',
      data: params
    })
  },
  editComment : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/editComment`,
      method: 'post',
      data: params
    })
  },
  getCourse : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getCourse`,
      method: 'get',
      data: params
    })
  },
  addChapter : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/addCourseChapter`,
      method: 'post',
      data: params
    })
  },
  getChapter : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getChapter`,
      method: 'post',
      data: params
    })
  },
  addChildChapter : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/addCourseChildChapter`,
      method: 'post',
      data: params
    })
  },
  delChapter :  params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/delCourseChapter`,
      method: 'post',
      data: params
    })
  },
  updateChapter : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/updateChapter`,
      method: 'post',
      data: params
    })
  },
  getChildChapter : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getChildChapter`,
      method: 'post',
      data: params
    })
  },
  updateChildChapter : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/updateChildChapter`,
      method: 'post',
      data: params
    })
  },
  delChildChapter : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/delChildChapter`,
      method: 'post',
      data: params
    })
  },
  getIsShowContent : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/getIsShowContent`,
      method: 'post',
      data: params
    })
  },
  setIsShowContent : params => {
    return request({
      url: config.BaseUrl + `/api/it_admin/setIsShowContent`,
      method: 'post',
      data: params
    })
  }
}
export default api
