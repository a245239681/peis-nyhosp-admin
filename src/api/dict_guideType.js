import axios from '@/libs/api.request'

// 获取指引单分组列表
export const guideTypeList = (pagination, params) => {
  return axios.request({
    url: `/package/dictGuideType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改
export const guideTypeSave = (params) => {
  return axios.request({
    url: '/package/dictGuideType/save',
    method: 'post',
    data: params
  })
}

// 删除
export const guideTypeDelete = (params) => {
  return axios.request({
    url: '/package/dictGuideType/delete',
    method: 'post',
    data: params
  })
}
