import request from '@/utils/request'
import config from '@/utils/config'

export function login(username, password) {
  return request({
    url: config.BaseUrl + '/api/app_login/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: config.BaseUrl + '/api/app_login/autoLogin',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: config.BaseUrl + '/user/logout',
    method: 'post'
  })
}
