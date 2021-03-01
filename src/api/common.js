import axios from '@/libs/api.request'

// 获取输入内容的拼音码、五笔码
export const getCode = (params) => {
  return axios.request({
    url: `/common-dict/dictDisease/getPyAndWb`,
    method: 'post',
    data: params
  })
}
