import axios from '@/libs/api.request'

// 获取平台消息列表
export const msgList = (pagination, params) => {
  return axios.request({
    url: `/system-dict/platformMessage/findPlatformMessageByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 重发消息
export const retryMsg = (params) => {
  return axios.request({
    url: `/system-dict/platformMessage/retryPlatformMessageById`,
    method: 'post',
    data: params
  })
}

// 重新生成消息
export const rebuildMsg = (params) => {
  return axios.request({
    url: `/system-dict/platformMessage/regenPlatformMessageById`,
    method: 'post',
    data: params
  })
}