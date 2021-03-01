import axios from '@/libs/api.request'

// 获取单位部门信息树列表
export const UnitDeptTreeData = (params) => {
  return axios.request({
    url: `/booking/dictDictDepartment/newListAllTree`,
    method: 'post',
    data: params
  })
}

// 获取单位部门列表
export const unitDeptList = (pagination, params) => {
  return axios.request({
    url: `/booking/unit/findUnitData?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改部门
export const unitDeptSave = (params) => {
  return axios.request({
    url: '/booking/dictDictDepartment/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 删除部门
export const unitDeptDel = (params) => {
  return axios.request({
    url: '/booking/dictDictDepartment/delDept',
    method: 'post',
    data: params
  })
}

// 更新个人部门
export const unitDeptUpdate = (params) => {
  return axios.request({
    url: '/booking/dictDictDepartment/updateDept',
    method: 'post',
    data: params
  })
}
