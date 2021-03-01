import axios from '@/libs/api.request'

// 左边公司列表分页查询
export const UnitsList = (pagination, params) => {
  return axios.request({
    url: `/booking/unitTransferManagement/unitByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 单位转账管理表分页查询接口
export const getTransferList = (pagination, params) => {
  return axios.request({
    url: `/booking/unitTransferManagement/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 单位转账管理表保存接口
export const transferSave = (params) => {
  return axios.request({
    url: '/booking/unitTransferManagement/saveAndUpdate',
    method: 'post',
    data: params
  })
}

// 单位转账管理表删除接口
export const delTransfer = (params) => {
  return axios.request({
    url: '/booking/unitTransferManagement/delete',
    method: 'post',
    data: params
  })
}
