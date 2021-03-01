import axios from '@/libs/api.request'

// 获取体检人员列表
export const unitRegisterList = (pagination, params) => {
  return axios.request({
    url: `/booking/unit/findUnitData?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 登记
export const unitPersonRegister = (params) => {
  return axios.request({
    url: `/booking/register/saveUnit`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}

// 重启登记任务
export const reloadRegisterMission = (params) => {
  return axios.request({
    url: `/booking/register/handleBuffer`,
    method: 'post',
    data: params
  })
}

// 查询登记进度
export const checkRegisterProgress = (params) => {
  return axios.request({
    url: `/booking/register/countBuffer`,
    method: 'post',
    data: params
  })
}
