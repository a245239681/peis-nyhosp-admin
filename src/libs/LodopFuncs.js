import iView from 'iview'
import config from '@/config'
// import { getPrinterConfigFromLocalstorage } from '@/libs/util'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

//= ===页面动态加载C-Lodop云打印必须的文件CLodopfuncs.js====
// 如果是苹果电脑不加载lodop
let isMac = /macintosh|mac os x/i.test(navigator.userAgent)
if (!isMac) {
  var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement

  // //让其它电脑的浏览器通过本机打印（仅适用C-Lodop自带的例子）：
  // var oscript = document.createElement("script");
  // oscript.src ="/CLodopfuncs.js";
  // head.insertBefore( oscript,head.firstChild );

  // 让本机的浏览器打印(更优先一点)：
  oscript = document.createElement('script')
  oscript.src = 'http://localhost:8000/CLodopfuncs.js?priority=2'
  head.insertBefore(oscript, head.firstChild)

  // 加载双端口(8000和18000）避免其中某个端口被占用：
  var oscript = document.createElement('script')
  oscript.src = 'http://localhost:18000/CLodopfuncs.js?priority=1'
  head.insertBefore(oscript, head.firstChild)
}

//= ===获取LODOP对象的主过程：====
export function getLodop (oOBJECT, oEMBED) {
  if (!isMac) {
    let LODOP
    try {
      try {
        LODOP = getCLodop()
      } catch (err) {
        console.log(err)
        iView.Modal.info({
          title: '和湛科技体检系统',
          content: `检测到该电脑未安装打印插件，请联系管理员安装相关打印插件。<a href="./plugins/lodop.zip" download="lodop.zip">点击此处下载打印插件</a>`
        })
        return
      }

      if (!LODOP && document.readyState !== 'complete') {
        iView.Modal.warning({
          title: '和湛科技体检系统',
          content: 'Lodop打印插件没准备好，请稍后再试！'
        })
        return
      }

      // 清理原例子内的object或embed元素，避免乱提示：
      if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED)
      if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT)

      LODOP.SET_LICENSES('广西和湛科技有限公司', 'A563B96D47349ADBF371162E393C53F6AE2', '廣西和湛科技有限公司', '750CFA946A1D6842765C2B772159BF47828')
      LODOP.SET_LICENSES('THIRD LICENSE', '', 'Guangxi Healthan Technology Co.Ltd.', '649C528AF1D13ADB221196FDA6771452C50')

      return LODOP
    } catch (err) {
      // console.log(err)
    }
  }
}

function needCLodop () {
  return true // 这里强制所有浏览器都调用C-Lodop
}
