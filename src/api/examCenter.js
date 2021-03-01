import axios from '@/libs/api.request'

// 新增、修改体检中心
export const examCenterSave = (params) => {
  return axios.request({
    url: '/system-dict/sdOrg/save',
    method: 'post',
    data: params
  })
}

// 获取体检中心内容
export const examCenterList = (params) => {
  return axios.request({
    url: `/system-dict/sdOrg/getSdOrgInfo`,
    method: 'post',
    data: params
  })
}
