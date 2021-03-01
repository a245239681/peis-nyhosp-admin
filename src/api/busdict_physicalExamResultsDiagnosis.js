import axios from '@/libs/api.request'

// 获取体检项目结果对照列表
export const dictItemAutoDiagnosisList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictItemAutoDiagnosis/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

export const dictDiseaseAndSuggestionList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictItemAutoDiagnosis/getDictDiseaseAndSuggestionListByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictItemAutoDiagnosisSave = (params) => {
  return axios.request({
    url: '/common-dict/dictItemAutoDiagnosis/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictItemAutoDiagnosisStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictItemAutoDiagnosis/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictItemAutoDiagnosisDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictItemAutoDiagnosis/delete',
    method: 'post',
    data: params
  })
}
