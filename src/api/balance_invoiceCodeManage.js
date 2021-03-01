import axios from '@/libs/api.request'

// 获取发票号段列表
export const invoiceReceiptList = (pagination, params) => {
  return axios.request({
    url: `/booking/invoiceReceipt/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 分配发票
export const invoiceReceipt = (params) => {
  return axios.request({
    url: '/booking/invoiceReceipt/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 获取科室工作人员信息列表
export const saffByDeptName = (params) => {
  return axios.request({
    url: '/power/dictUser/getDictUserByDeptName',
    method: 'post',
    data: params
  })
}
