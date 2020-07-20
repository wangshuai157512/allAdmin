import request from '@/utils/request'
import config from '@/utils/config'

export function getQuestionUserList(params) {
  return request({
    url: config.BaseUrl + '/api/app_question/getUser',
    method: 'post',
    data: params
  })
}
