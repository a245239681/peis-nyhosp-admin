import axios from '@/libs/api.request'

// 获取页面url
export const pageUrlList = (params) => {
  return axios.request({
    url: '/power/menu/getMenuUrl',
    method: 'post',
    data: params
  })
}
