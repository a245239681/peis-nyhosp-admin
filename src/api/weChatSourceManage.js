import axios from '@/libs/api.request'

// 查询所有号源成功
export const wechatSourceList = (params) => {
  return axios.request({
    url: `/common-dict/peBookingSourceNo/findAll`,
    method: 'post',
    data: params
  })
}

// 号源删除
export const wechatSourceDelete = (params) => {
  return axios.request({
    url: `/common-dict/peBookingSourceNo/deleteById`,
    method: 'post',
    data: params
  })
}

// 单个号源保存和更新
export const wechatSourceUpdate = (params) => {
  return axios.request({
    url: `/common-dict/peBookingSourceNo/saveOrUpdate`,
    method: 'post',
    data: params
  })
}

// 批量保存接口
export const wechatSourceAllUpdate = (params) => {
  return axios.request({
    url: `/common-dict/peBookingSourceNo/batchSaveOrUpdate`,
    method: 'post',
    data: params
  })
}
