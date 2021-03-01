import axios from '@/libs/api.request'

export const login = (params) => {
  return axios.request({
    url: '/router/login',
    data: params,
    method: 'post'
  })
}
// 获取机构列表
export const getOrgList = () => {
  return axios.request({
    url: '/system-dict/sdOrg/getList',
    method: 'get'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/power/staff/getUserInfo',
    method: 'get',
    headers: {
      'token': token
    }
  })
}

export const logout = () => {
  return axios.request({
    url: '/router/logout',
    method: 'post'
  })
}

// 修改密码
export const updatePassword = (params) => {
  return axios.request({
    url: '/power/dictUser/updatePassword',
    method: 'post',
    data: params
  })
}
