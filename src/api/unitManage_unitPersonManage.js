import axios from '@/libs/api.request'

// 获取体检人员列表
export const unitPersonMasterList = (pagination, params) => {
  return axios.request({
    url: `/booking/masterIndex/newListByPageUnit?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 体检记录导入列表
export const unitPersonMasterList1 = (pagination, params) => {
  return axios.request({
    url: `/booking/masterIndex/listByPageUnit1?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 添加人员
export const unitPersonAdd = (params) => {
  return axios.request({
    url: '/booking/masterIndex/saveOrUpdateByUnit',
    method: 'post',
    data: params
  })
}

// 单个移除分组
export const removeGroup = (params) => {
  return axios.request({
    url: '/booking/masterIndex/newRemoveGroup',
    method: 'post',
    data: params
  })
}

// 根据单位分组id获取单位信息树列表
// export const UnitInfoListByGroup = (pagination, params) => {
//   return axios.request({
//     url: `/booking/masterIndex/newListByPageUnit?page=${pagination.page}&size=${pagination.size}`,
//     method: 'post',
//     data: params
//   })
// }

// 体检记录导入
export const saveMasterIndexBatch = (params) => {
  return axios.request({
    url: '/booking/unit/saveMasterIndexBatch',
    method: 'post',
    data: params
  })
}

// 下载excel模板
export const downExcelTemplate = (params) => {
  return axios.request({
    url: '/booking/masterIndex/downloadExcel',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 上传Excel数据
export const importExcel = (config, params) => {
  return axios.request({
    url: `/booking/masterIndex/importExcel?boUnitId=${config.boUnitId}&boUnitName=${config.boUnitName}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params,
    timeout: 1000 * 600
  })
}

// 导入处理后的数据
export const importData = (params) => {
  return axios.request({
    url: `/booking/masterIndex/batchImport`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}

// 根据身份证查询档案
export const getMasterIndexByNameAndIdNo = (params) => {
  return axios.request({
    url: '/booking/booking/listByStatus',
    method: 'post',
    data: params
  })
}

// 根据姓名获取档案列表
export const getFileListByName = (params) => {
  return axios.request({
    url: `/booking/masterIndex/getPeIdByName`,
    method: 'post',
    data: params
  })
}

// 根据单位名称查询部门和子部门
export const getDeptInfoByUnit = (params) => {
  return axios.request({
    url: `/booking/dictDictDepartment/findDept`,
    method: 'post',
    data: params
  })
}
