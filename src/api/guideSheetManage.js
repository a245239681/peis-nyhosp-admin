import axios from '@/libs/api.request'

// 指引单管理页面查询接口
export const findGuide = (pagination, params) => {
  return axios.request({
    url: `/booking/register/findGuide?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

export const findGuidePrint = (params) => {
  return axios.request({
    url: `/booking/register/finPrinting`,
    method: 'post',
    data: params
  })
}

export const guideSheetPrint = (params) => {
  return axios.request({
    url: `/booking/register/printingGuide`,
    method: 'post',
    data: params
  })
}