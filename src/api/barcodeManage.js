import axios from '@/libs/api.request'

// 查询条码标签
export const checkBarcode = (params) => {
  return axios.request({
    url: '/booking/barcodeApply/findAll',
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}

// 条码标签批量打印
export const barcodePrint = (params) => {
  return axios.request({
    url: '/booking/barcodeApply/getBarCodePdf',
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}

// 条码标签批量打印 - 多个PDF
export const barcodePrintMore = (params) => {
  return axios.request({
    url: '/booking/barcodeApply/getBarcodeApplyPdf',
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
