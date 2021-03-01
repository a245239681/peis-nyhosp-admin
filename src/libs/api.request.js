import HttpRequest from '@/libs/axios'
import config from '@/config'
// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
let baseUrl

if (process.env.NODE_ENV === 'development') {
  baseUrl = config.baseUrl.dev
} else if (process.env.VUE_APP_CURRENTMODE === 'test') {
  baseUrl = config.baseUrl.test
} else if (process.env.VUE_APP_CURRENTMODE === 'production') {
  baseUrl = config.baseUrl.pro
} else {
  baseUrl = config.baseUrl.preview
}

const axios = new HttpRequest(baseUrl)
export default axios
