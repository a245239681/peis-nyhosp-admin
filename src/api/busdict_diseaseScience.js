import axios from '@/libs/api.request'

// 获取疾病名称列表
export const dictDiseaseKnowledgetList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDiseaseKnowledge/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictDiseaseKnowledgeSave = (params) => {
  return axios.request({
    url: '/common-dict/dictDiseaseKnowledge/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictDiseaseKnowledgeStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictDiseaseKnowledge/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictDiseaseKnowledgeDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictDiseaseKnowledge/delete',
    method: 'post',
    data: params
  })
}
