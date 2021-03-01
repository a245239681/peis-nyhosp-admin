import axios from '@/libs/api.request'

// 获取疾病信息列表
export const dictDiseaseList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDisease/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictDiseaseSave = (params) => {
  return axios.request({
    url: '/common-dict/dictDisease/save',
    method: 'post',
    data: params
  })
}

// 根据科室ID查询对应的疾病
// export const dictDiseaseByDeptIdList = (pagination, params) => {
//   return axios.request({
//     url: `/common-dict/dictDisease/diseaseListByPage?page=${pagination.page}&size=${pagination.size}`,
//     method: 'post',
//     data: params
//   })
// }

// 根据疾病id获取疾病信息
export const dictDiseaseInfo = (params) => {
  return axios.request({
    url: '/common-dict/dictDisease/getDiseaseInfo',
    method: 'post',
    data: params
  })
}

// 根据ICD10 id查询ICD10编码
export const baseIcd10List = (params) => {
  return axios.request({
    url: '/common-dict/baseIcd10/list',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictDiseaseStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictDisease/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictDiseaseDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictDisease/delete',
    method: 'post',
    data: params
  })
}
