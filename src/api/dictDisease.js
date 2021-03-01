import axios from '@/libs/api.request'

// 获取疾病名称列表
export const dictDiseaseList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDisease/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const diseaseTypeSave = (params) => {
  return axios.request({
    url: '/common-dict/diseaseType/save',
    method: 'post',
    data: params
  })
}

// // 修改状态
// export const dictDeptConclusionStatus = (params) => {
//   return axios.request({
//     url: '/common-dict/dictDeptConclusion/updateStatus',
//     method: 'post',
//     data: params
//   })
// }

// 删除疾病分类
export const diseaseTypeDelete = (params) => {
  return axios.request({
    url: '/common-dict/diseaseType/delete',
    method: 'post',
    data: params
  })
}
