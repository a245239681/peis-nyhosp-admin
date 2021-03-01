import iView from 'iview'
import { getLodop } from '@/libs/LodopFuncs.js'
import { demoDownloadPDF } from '@/libs/tools.js'
let LODOP

// 打印条码专用方法
function directBarcode (barcodeUrl, printer) {
  if (!printer) printer = -1
  LODOP = getLodop()
  LODOP.PRINT_INIT('直接打印个人条码')
  LODOP.SET_PRINTER_INDEXA(printer)
  // LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", barcodeUrl)
  LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true)
  LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', '95%')
  LODOP.ADD_PRINT_PDF(0, 10, '100%', '100%', demoDownloadPDF(barcodeUrl)) // Https方式)需先下载好再打印
  LODOP.PRINT()
}
function directBarcodeMore (barcodeUrl, printer, index) {
  if (!printer) printer = -1
  LODOP = getLodop()
  LODOP.PRINT_INIT('直接打印批量个人条码' + index)
  LODOP.SET_PRINTER_INDEXA(printer)
  LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true)
  LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', '95%')
  LODOP.ADD_PRINT_PDF(0, 10, '100%', '100%', demoDownloadPDF(barcodeUrl)) // Https方式)需先下载好再打印
  LODOP.PRINT()
}
// 打印A4纸专用方法
function directGuide (guideUrl, printer, taskName = '指引单') {
  if (!printer) printer = -1
  LODOP = getLodop()
  LODOP.PRINT_INIT('直接打印' + taskName)
  LODOP.SET_PRINTER_INDEXA(printer)
  LODOP.SET_PRINT_PAGESIZE(1, 0, 0, 'A4')
  LODOP.ADD_PRINT_PDF(0, 0, '100%', '100%', demoDownloadPDF(guideUrl)) // Https方式)需先下载好再打印
  LODOP.PRINT()
}
function directGuideMore (guideUrl, printer, taskName, index) {
  if (!printer) printer = -1
  LODOP = getLodop()
  LODOP.PRINT_INIT('直接打印' + taskName + index)
  LODOP.SET_PRINTER_INDEXA(printer)
  LODOP.SET_PRINT_PAGESIZE(1, 0, 0, 'A4')
  LODOP.ADD_PRINT_PDF(0, 0, '100%', '100%', demoDownloadPDF(guideUrl)) // Https方式)需先下载好再打印
  LODOP.PRINT()
}
// 打印发票专用方法
function directInvoice (invoiceUrl, printer) {
  if (!printer) printer = -1
  LODOP = getLodop()
  LODOP.PRINT_INIT('直接打印发票')
  LODOP.SET_PRINTER_INDEXA(printer)
  LODOP.SET_PRINT_PAGESIZE(1, '210mm', '127mm', '')
  LODOP.ADD_PRINT_PDF(0, 0, '100%', '100%', demoDownloadPDF(invoiceUrl))
  LODOP.PRINT()
}
/** lodop打印封装函数 - 直接打印功能
 * params 传入参数
 * defaultPrinter 字符串，默认A4打印机名字
 * barcodePrinter 字符串，默认条码打印机名字
 * invoiceUrl 字符串，缴费发票PDF的链接地址
 * barcodeUrl 字符串，条码PDF的链接地址
 * guideUrl 字符串，指引单PDF的链接地址
 * requestUrl 字符串，申请单PDF的链接地址
 * selGroup  数组, A4纸张为printGuide, 条码单printSampleCode, 申请单createRequestNote, 发票为printInvoice
 * 示例：{
 *  selGroup: ['printGuide', 'printSampleCode'],
 *  barcodeUrl: 'http://117.141.4.40:28087/booking/pdf/20190712175136barCodeOut.pdf'
 *  guideUrl: 'http://117.141.4.40:28087/booking/pdfguide/1562925311452guide.pdf'
 * }
 * */

export const directPrintFunc = (params) => {
  if (!params.selGroup.length) {
    iView.Message.warning('无任何打印任务，如果需要打印，请到体检进度综合管理页面处理！')
    return
  }
  if (params.selGroup.length == 1 && params.selGroup.indexOf('printInvoice') > -1) {
    if (!params.invoiceUrl) return
    directInvoice(params.invoiceUrl, params.invoicePrinter)
  }
  if (params.selGroup.length == 1 && params.selGroup.indexOf('printSampleCode') > -1) {
    if (!params.barcodeUrl) return
    if (typeof params.barcodeUrl === 'string') {
      directBarcode(params.barcodeUrl, params.barcodePrinter)
    }
    if (params.barcodeUrl instanceof Array) {
      params.barcodeUrl.forEach((item, index) => {
        directBarcodeMore(item, params.barcodePrinter, index)
      })
    }
  }
  if (params.selGroup.length == 1 && params.selGroup.indexOf('printGuide') > -1) {
    if (!params.guideUrl) return
    if (typeof params.guideUrl === 'string') {
      directGuide(params.guideUrl, params.defaultPrinter, params.taskName)
    }
    if (params.guideUrl instanceof Array) {
      params.guideUrl.forEach((item, index) => {
        directGuideMore(item, params.defaultPrinter, params.taskName, index)
      })
    }
  }
  if (params.selGroup.length == 2 && params.selGroup.indexOf('printSampleCode') > -1 && params.selGroup.indexOf('printGuide') > -1) {
    // 个人登记
    if (typeof params.barcodeUrl === 'string') {
      if (!params.barcodeUrl) return
      directBarcode(params.barcodeUrl, params.barcodePrinter)
      // if (!params.guideUrl) return
      // directGuide(params.guideUrl, params.defaultPrinter, params.taskName)
    }
    if (typeof params.guideUrl === 'string') {
      if (!params.guideUrl) return
      directGuide(params.guideUrl, params.defaultPrinter, params.taskName)
    }
    // 超过两千页PDF的登记
    if (params.barcodeUrl instanceof Array) {
      if (!params.barcodeUrl) return
      params.barcodeUrl.forEach((item, index) => {
        directBarcodeMore(item, params.barcodePrinter, index)
      })
      // params.guideUrl.forEach((item, index) => {
      //   directGuideMore(item, params.guidePrinter, params.taskName, index)
      // })
    }
    if (params.guideUrl instanceof Array) {
      if (!params.guideUrl) return
      params.guideUrl.forEach((item, index) => {
        directGuideMore(item, params.guidePrinter, params.taskName, index)
      })
    }
  }
}
