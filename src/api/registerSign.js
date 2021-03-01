import axios from '@/libs/api.request'

// 新增、修改类别
export const registerSign = (params) => {
  return axios.request({
    url: '/booking/patientVisit/saveSignIn',
    method: 'post',
    data: params
  })
}