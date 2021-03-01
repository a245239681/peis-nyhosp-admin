import iView from 'iview'
import { getPrinterConfigFromLocalstorage } from '@/libs/util'
import { printFunc } from '@/libs/printOrder.js'
import { directPrintFunc } from '@/libs/directPrint.js'

export const printNotice = () => {
  let printConfig = getPrinterConfigFromLocalstorage()
  if (JSON.stringify(printConfig) === '{}') {
    iView.Message.error('请在右上角配置打印机')
    return false
  } else {
    return true
  }
}

export const printMethods = (url, printParams) => {
  let printConfig = getPrinterConfigFromLocalstorage()
  if (printConfig.browserPreview) {
    if (!url) return false
    if (typeof url === 'string') {
      window.open(url, '_blank', 'width=800,height=650, left=300')
    }
    if (url instanceof Array) {
      url.forEach(item => {
        window.open(item, '_blank', 'width=800,height=650, left=300')
      })
    }
  }
  if (printConfig.lodopPreview) {
    Object.assign(printParams, printConfig)
    printFunc(printParams)
  }
  if (printConfig.lodopPrint) {
    Object.assign(printParams, printConfig)
    directPrintFunc(printParams)
  }
}
