import axios from '@/libs/api.request'

// 体检单位分组字典新增接口
export const saveUnitGroup = (params) => {
  return axios.request({
    url: '/booking/dictUnitGrouping/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 体检单位分组字典分页查询接口
export const getUnitGroupList = (pagination, params) => {
  return axios.request({
    url: `/booking/dictUnitGrouping/findUnitGroupingInfo?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 体检单位分组字典删除接口
export const delUnitGroup = (params) => {
  return axios.request({
    url: '/booking/dictUnitGrouping/delete',
    method: 'post',
    data: params
  })
}

// 获取项目组合树
export const getMoreItemTree = (params) => {
  return axios.request({
    url: '/package/combo/findComboTreeUnit',
    method: 'post',
    data: params
  })
}

// 根据单位查询该单位体检次数及对应分组
export const unitGroupInfo = (params) => {
  return axios.request({
    url: '/booking/dictUnitGrouping/unitInfoByUnitId',
    method: 'post',
    data: params
  })
}
