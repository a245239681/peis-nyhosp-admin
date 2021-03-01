import axios from '@/libs/api.request'

// 体检类别字典列表
export const categoryList = (params) => {
  return axios.request({
    url: '/common-dict/dictCategory/list',
    data: params,
    method: 'post'
  })
}
