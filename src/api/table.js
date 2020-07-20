import request from '@/utils/request'
import config from '@/utils/config'

export function getList(params) {
  return request({
    url: config.BaseUrl + '/api/app_article/get',
    method: 'post',
    data: params
  })
}

export function delArticle(articleId) {
  return request({
    url: config.BaseUrl + '/api/app_article/del',
    method: 'post',
    data: { articleId }
  })
}

export function addArticle(newdata) {
  return request({
    url: config.BaseUrl + '/api/app_article/add',
    method: 'post',
    data: newdata
  })
}

export function lookArticle(id) {
  return request({
    url: config.BaseUrl + '/api/app_article/look',
    method: 'post',
    data: {
      id
    }
  })
}

export function editArticle(id, newdata) {
  newdata.id = id
  return request({
    url: config.BaseUrl + '/api/app_article/edit',
    method: 'post',
    data: newdata
  })
}
