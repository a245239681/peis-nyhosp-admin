import axios from "axios";
import store from "@/store";
import router from "@/router";
import iview from "iview";
import { removeToken, getToken } from "@/libs/util.js";

// import { Spin } from 'iview'
const addErrorLog = (errorInfo) => {
  const {
    statusText,
    status,
    request: { responseURL },
  } = errorInfo;
  let info = {
    type: "ajax",
    code: status,
    mes: statusText,
    url: responseURL,
  };
  if (!responseURL.includes("save_error_logger"))
    store.dispatch("addErrorLog", info);
};

let flag = true;
class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true;
        let token = getToken();
        if (token) {
          config.headers["token"] = token;
        }
        return config;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );

    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        this.destroy(url);
        if (res.data && res.data.code && res.data.code == 400) {
          if (flag) {
            flag = false;
            removeToken();
            store.commit("setAccess", []);
            store.commit("setHasGetInfo", false);
            router.push({
              name: "login",
            });
            iview.Message.error({
              content: "token失效，请重新登录",
              duration: 3,
              onClose: () => {
                flag = true;
              },
            });
          }

          return false;
        }
        const { data, status, headers } = res;
        return {
          data,
          status,
          headers,
        };
      },
      (error) => {
        this.destroy(url);
        // addErrorLog(error.response)
        // if (error.response.status == 400) {
        //   removeToken()
        //   router.push({
        //     name: 'login'
        //   })
        // }
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = axios.create({
      timeout: 1000 * 30,
      withCredentials: false, // 生产环境改成false，不然打包出来会出现跨域
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
