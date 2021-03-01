import iView from 'iview'
import { getLodop } from '@/libs/LodopFuncs.js'
import { demoDownloadPDF } from '@/libs/tools.js'
let LODOP
// 预览打印发票的方法
function invoice (invoiceUrl, printer) {
  if (!printer) printer = -1
  return new Promise((resolve) => {
    LODOP = getLodop()
    LODOP.PRINT_INIT('打印发票')
    LODOP.SET_PRINTER_INDEXA(printer)
    LODOP.SET_PREVIEW_WINDOW(2, 0, 0, 800, 600, '')
    LODOP.SET_SHOW_MODE('HIDE_PAPER_BOARD', 1)
    LODOP.SET_PRINT_PAGESIZE(1, '210mm', '127mm', '')
    LODOP.ADD_PRINT_PDF(0, 0, '100%', '100%', demoDownloadPDF(invoiceUrl))
    LODOP.PREVIEW()
    if (LODOP.CVERSION) {
      LODOP.On_Return = function (TaskID, Value) {
        // console.log(Value)
        // console.log(TaskID)
        resolve(Value)
      }
    }
  })
}
// 预览打印条码的方法
function barcode (barcodeUrl, printer, index = 0) {
  if (!printer) printer = -1
  return new Promise((resolve) => {
    LODOP = getLodop()
    LODOP.PRINT_INIT('打印个人条码' + index)
    LODOP.SET_PRINTER_INDEXA(printer)
    LODOP.SET_PREVIEW_WINDOW(1, 0, 0, 800, 600, '')
    LODOP.SET_SHOW_MODE('HIDE_PAPER_BOARD', 1)
    LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true)
    LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', '95%')
    LODOP.ADD_PRINT_PDF(0, 10, '100%', '100%', demoDownloadPDF(barcodeUrl)) // Https方式)需先下载好再打印
    LODOP.PREVIEW()
    if (LODOP.CVERSION) {
      CLODOP.On_Return = function (TaskID, Value) {
        // console.log(Value)
        // console.log(TaskID)
        resolve(Value)
      }
    }
  })
}
// 多个条码PDF路径返回数组，接收递归处理
function diguiBarcode (urlArr, printer, index = 0) {
  let currentUrl = urlArr.shift()
  let i = index + 1
  if (currentUrl) {
    barcode(currentUrl, printer, i).then(barcodeValue => {
      if (barcodeValue == 0) {
        iView.Modal.warning({
          title: '和湛科技体检系统',
          content: '条码打印任务' + i + '，未执行打印。'
        })
        diguiBarcode(urlArr, printer, i)
      }
      if (barcodeValue == 1) {
        iView.Modal.info({
          title: '和湛科技体检系统',
          content: '条码打印任务' + i + '，打印完成。'
        })
        diguiBarcode(urlArr, printer, i)
      }
    })
  }
}
// 预览打印A4的方法
function guide (guideUrl, printer, taskName, index = 0) {
  if (!printer) printer = -1
  return new Promise((resolve) => {
    LODOP = getLodop()
    LODOP.PRINT_INIT('打印' + taskName + index)
    LODOP.SET_PRINTER_INDEXA(printer)
    LODOP.SET_PREVIEW_WINDOW(2, 0, 0, 800, 600, '')
    LODOP.SET_SHOW_MODE('HIDE_PAPER_BOARD', 1)
    LODOP.SET_PRINT_PAGESIZE(1, 0, 0, 'A4')
    LODOP.ADD_PRINT_PDF(0, 0, '100%', '100%', demoDownloadPDF(guideUrl))
    LODOP.PREVIEW()
    if (LODOP.CVERSION) {
      LODOP.On_Return = function (TaskID, Value) {
        // console.log(Value)
        // console.log(TaskID)
        resolve(Value)
      }
    }
  })
}
// 多个A4-PDF路径返回数组，接收递归处理
function diguiGuide (urlArr, printer, taskName = '指引单', index = 0) {
  let currentUrl = urlArr.shift()
  let i = index + 1
  if (currentUrl) {
    guide(currentUrl, printer, taskName, i).then(guideValue => {
      if (guideValue == 0) {
        iView.Modal.warning({
          title: '和湛科技体检系统',
          content: taskName + '打印任务' + i + '，未执行打印。'
        })
        diguiGuide(urlArr, printer, taskName, i)
      }
      if (guideValue == 1) {
        iView.Modal.info({
          title: '和湛科技体检系统',
          content: taskName + '打印任务' + i + '，打印完成。'
        })
        diguiGuide(urlArr, printer, taskName, i)
      }
    })
  }
}

function digui2 (barcodeUrlArr, barcodePrinter, index = 0, guideUrlArr, guidePrinter) {
  let currentUrl = barcodeUrlArr.shift()
  let i = index + 1
  if (currentUrl) {
    console.log('barcode' + index + '执行')
    barcode(currentUrl, barcodePrinter, i).then(barcodeValue => {
      if (barcodeValue == 0) {
        iView.Modal.warning({
          title: '和湛科技体检系统',
          content: '条码打印任务' + i + '，未执行打印。'
        })
        digui2(barcodeUrlArr, barcodePrinter, i, guideUrlArr, guidePrinter)
      }
      if (barcodeValue == 1) {
        iView.Modal.info({
          title: '和湛科技体检系统',
          content: '条码打印任务' + i + '，打印完成。'
        })
        digui2(barcodeUrlArr, barcodePrinter, i, guideUrlArr, guidePrinter)
      }
    })
  } else {
    console.log('guide执行了')
    diguiGuide(guideUrlArr, guidePrinter)
  }
}

/** lodop打印封装函数 - 预览打印功能
 * params 传入参数
 * defaultPrinter 字符串，默认A4打印机名字
 * barcodePrinter 字符串，默认条码打印机名字
 * barcodeUrl 字符串，条码PDF的链接地址
 * invoiceUrl 字符串，缴费发票PDF的链接地址
 * guideUrl 字符串，A4纸张-PDF的链接地址
 * requestUrl 字符串，申请单PDF的链接地址
 * selGroup  数组, 发票为printInvoice, A4纸张为printGuide, 条码单printSampleCode, 申请单createRequestNote
 * 示例：{
 *  selGroup: ['printGuide', 'printSampleCode'],
 *  barcodeUrl: 'http://117.141.4.40:28087/booking/pdf/20190712175136barCodeOut.pdf'
 *  guideUrl: 'http://117.141.4.40:28087/booking/pdfguide/1562925311452guide.pdf'
 * }
 * */

export const printFunc = (params) => {
  if (!params.selGroup.length) {
    iView.Message.warning('无任何打印任务，如果需要打印，请到体检进度综合管理页面处理！')
    return
  }
  if (params.selGroup.length == 1 && params.selGroup.indexOf('printInvoice') > -1) {
    if (!params.invoiceUrl) return
    invoice(params.invoiceUrl, params.invoicePrinter)
  }
  if (params.selGroup.length == 1 && params.selGroup.indexOf('printSampleCode') > -1) {
    // console.log(params.barcodeUrl)
    if (!params.barcodeUrl) return
    if (typeof params.barcodeUrl === 'string') {
      barcode(params.barcodeUrl, params.barcodePrinter)
    }
    if (params.barcodeUrl instanceof Array) {
      diguiBarcode(params.barcodeUrl, params.barcodePrinter)
    }
  }
  if (params.selGroup.length == 1 && params.selGroup.indexOf('printGuide') > -1) {
    // console.log(params.guideUrl)
    if (!params.guideUrl) return
    if (typeof params.guideUrl === 'string') {
      guide(params.guideUrl, params.defaultPrinter, params.taskName)
    }
    if (params.guideUrl instanceof Array) {
      diguiGuide(params.guideUrl, params.defaultPrinter, params.taskName)
    }
  }
  if (params.selGroup.length == 2 && params.selGroup.indexOf('printSampleCode') > -1 && params.selGroup.indexOf('printGuide') > -1) {
    // console.log('接收barcodeUrl' + params.barcodeUrl )
    // console.log('guideUrl' + params.guideUrl )
    if (typeof params.barcodeUrl === 'string' && typeof params.guideUrl === 'string') {
      if (!params.barcodeUrl) return
      barcode(params.barcodeUrl, params.barcodePrinter).then(barcodeValue => {
        if (barcodeValue == 1) {
          iView.Modal.info({
            title: '和湛科技体检系统',
            content: '条码打印完成，即将预览打印指引单。'
          })
        }
        if (barcodeValue == 0) {
          iView.Modal.warning({
            title: '和湛科技体检系统',
            content: '条码未打印,需补打条码请到“条码标签管理”页面。'
          })
        }
        if (!params.guideUrl) return
        guide(params.guideUrl, params.defaultPrinter, params.taskName).then(guideValue => {
          if (guideValue == 1) {
            iView.Modal.info({
              title: '和湛科技体检系统',
              content: '指引单打印完成。'
            })
          }
          if (guideValue == 0) {
            iView.Modal.warning({
              title: '和湛科技体检系统',
              content: '指引单未打印,需补打指引单请到“指引单管理”页面。'
            })
          }
        })
      })
    }
    if (params.barcodeUrl instanceof Array && params.guideUrl instanceof Array) {
      if (!params.guideUrl && !params.barcodeUrl) return
      // console.log('两个都执行，开始递归')
      digui2(params.barcodeUrl, params.barcodePrinter, 0, params.guideUrl, params.defaultPrinter)
    }
  }
}
