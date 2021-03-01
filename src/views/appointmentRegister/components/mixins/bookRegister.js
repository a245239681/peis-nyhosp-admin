import {
  getBookingPackage,
  getComboByPackage,
  listByName
} from '@/api/personal_register.js'
import { getBirthAndAge, FilterByName } from '@/libs/tools.js'
import jsonp from 'jsonp'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

/* 体检预约，登记和个人信息修改 三个页面，通用下拉框列表的数据及方法 */
export const getSelectionList = {
  computed: {
    // countryList: {
    //   get: function () {
    //     return this.$store.getters.getCountryDict
    //   },
    //   set: function () { }
    // },
    // identityList: {
    //   get: function () {
    //     return this.$store.getters.getIdentityDict
    //   },
    //   set: function () { }
    // },
    // nationList: {
    //   get: function () {
    //     return this.$store.getters.getNationDict
    //   },
    //   set: function () { }
    // },
    // occupationList: {
    //   get: function () {
    //     return this.$store.getters.getOccupationDict
    //   },
    //   set: function () { }
    // },
    categoryList: {
      get: function () {
        return this.$store.getters.getCategoryDict
      },
      set: function () { }
    },
    priorityList: {
      get: function () {
        return this.$store.getters.getPriorityDict
      },
      set: function () { }
    },
    chargeTypeList: {
      get: function () {
        return this.$store.getters.getChargeTypeDict
      },
      set: function () { }
    },
    sourceList: {
      get: function () {
        return this.$store.getters.getPersonSourceDict
      },
      set: function () { }
    }
  },
  created () {
    // 获取体检优先级
    this.$store.dispatch('getPriorityDict')
    // 获取体检类型
    this.$store.dispatch('getCategoryDict')
    // 获取费别
    this.$store.dispatch('getChargeTypeDict').then(() => {
      this.setChargTypeDefault()
    })
    // 获取人员来源
    this.$store.dispatch('getPersonSourceDict')
    // 民族list，国家list，身份list，职业list
    // this.$store.dispatch('getCountryDict')
    // this.$store.dispatch('getNationDict')
    // this.$store.dispatch('getOccupationDict')
    // this.$store.dispatch('getIdentityDict')
  },
  methods: {
    //  设置费别，默认自费
    setChargTypeDefault () {
      let arr = this.$store.getters.getChargeTypeDict
      console.log(arr)
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].cdName === '自费') {
          this.patientInfoForm.boChargeTypeId = arr[i].cdId
          break
        }
      }
    },
    // 改变证件类型时，若为身份证，灰掉出生年月、年龄的输入框
    changeCert () {
      if (!this.patientInfoForm.boCertificatesType) return false
      if (this.patientInfoForm.boCertificatesType == 1) {
        if (this.patientInfoForm.boIdNo) {
          this.getAgeAndBirthday()
        }
        this.grayInput = true
      } else {
        this.patientInfoForm.boIdNo = ''
        this.patientInfoForm.boBirthday = ''
        this.patientInfoForm.boAge = ''
        this.grayInput = false
      }
    },
    // 输入框失焦时,根据身份证号，计算年龄和出生日期
    AgeAndBirthday () {
      if (this.patientInfoForm.boIdNo &&
        this.patientInfoForm.boCertificatesType == 1) {
        // if (this.importData) return
        let no = this.patientInfoForm.boIdNo.trim()
        let idNo = getBirthAndAge(no)
        if (idNo.message) {
          this.$Message.error(idNo.message)
          this.$set(this.patientInfoForm, 'boBirthday', '')
          this.$set(this.patientInfoForm, 'boAge', '')
          this.$set(this.patientInfoForm, 'boSex', '')
        } else {
          this.$set(this.patientInfoForm, 'boBirthday', idNo.birthday)
          this.$set(this.patientInfoForm, 'boAge', idNo.age)
          this.$set(this.patientInfoForm, 'boSex', idNo.sex)
        }
      }
      // 如果不是导入数据，清空请求参数，根据性别变更套餐
      // if (!this.getInfoByEnter) {
      //   this.$refs.packageInputDrop.filterText = ''
      //   this.searchPackageList = []
      //   this.pickProjectsTableData = []
      //   this.emptyText = '暂无数据'
      //   this.userPickPackageId = ''
      //   this.userPickPackageName = ''
      //   this.allPackages = []
      //   this.packagePageIndex = 1
      //   this.getPackagesList()
      // }
    },
    // 其他证件，修改出生日期时，计算年龄
    changeBirthday (e) {
      if (!e) return
      let birthday = e.split('-')
      // 获取当前年月日并计算年龄
      let myDate = new Date()
      let monthNow = myDate.getMonth() + 1
      let dayNow = myDate.getDate()
      let age = myDate.getFullYear() - birthday[0]
      if (monthNow < birthday[1] || (monthNow == birthday[1] && dayNow < birthday[2])) {
        age--
      }
      this.patientInfoForm.boAge = age
    },
    clearBirthday () {
      this.patientInfoForm.boAge = ''
    },
    // 更改体检优先级
    changePriority (e) {
      // console.log(e)
      if (e != undefined) {
        this.patientInfoForm.boPriority = e.label
      }
    },
    // 更改体检类型
    changeCategory (e) {
      // console.log(e)
      if (e != undefined) {
        this.patientInfoForm.boCategory = e.label
      }
    },
    // 更改费别
    changeChargeType (e) {
      if (e != undefined) {
        // console.log(e)
        this.patientInfoForm.boChargeType = e.label
      }
    },
    // 更改人员来源
    changeSource (e) {
      if (e != undefined) {
        // console.log(e)
        this.patientInfoForm.boSource = e.label
      }
    },
    // 搜索套餐
    searchPackage (query) {
      // console.log('我执行了搜索')
      // console.log('输入值')
      // console.log(query)
      // console.log(this.$refs.packageSelectBox)
      // 因输入值与已选套餐相同，减少发送请求
      if (!!query && this.userPickPackageName == query) return
      this.packageTimer && clearTimeout(this.packageTimer)
      this.packageTimer = setTimeout(() => {
        if (!this.packageSearchLoading) {
          this.isPackageMore = false
          this.packagePageIndex = 1
          this.allPackages = []
          this.searchPackageList = [] // 未选套餐 搜索框的列表
          this.getPackagesList(query)
        }
      }, 300)
    },
    selectPackage (value, label) {
      // console.log(value)
      // console.log(label)
      // console.log(this.$refs.packageInputDrop)
      if (!this.userPickPackageName && !this.userPickPackageId && !this.multiplyPackage) {
        this.userPickPackageName = label
        this.userPickPackageId = value
        this.multiplyPackage = true
        this.changePackage(value)
      } else {
        let params = {
          paPackageId: value
        }
        this.emptyText = '数据加载中...'
        getComboByPackage(params).then((res) => {
          let result = res.data
          // console.log(result);
          if (result.code === 0) {
            let arr = this.pickProjectsTableData.concat(result.data)
            this.pickProjectsTableData = FilterByName(arr, 'paId')
            // 个人
            this.patientInfoForm.grayOwnExpense = true
            this.pickProjectsTableData.forEach(item => {
              item.boComboSort = item.paSort
              item.isAddItem = 2
              item.boIsAdditional = 1
              item.boIsOwnExpense = '1'
            })
            console.log('个人-两个套餐自选')
            console.log(this.pickProjectsTableData)
            // 搜索添加了两个套餐以上，清空套餐信息，变为自选
            this.userPickPackageName = ''
            this.userPickPackageId = ''
            //  勾选项目组合处理
            this.delGrayOff()
            this.projectsChecked(this.pickProjectsTableData)
            //  恢复改价
            if (this.fixPrice) {
              this.fixPrice = false
            }
            // 清除掉传给后台的数据
            this.$set(this.patientInfoForm, 'boPackageId', null)
            this.$set(this.patientInfoForm, 'boPackageName', null)
            this.$set(this.patientInfoForm, 'boPackageCode', null)
            this.itemList = []
            //  随意更改套餐，加减项目
            this.pushItemList()
          } else {
            this.emptyText = '暂无数据'
            this.$Message.error(result.message)
          }
        }).catch(err => {
          console.log(err)
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }
      this.$refs.packageInputDrop.resetOptions()
    },
    clearPackage () {
      // console.log('我执行了清空')
      if (!this.packageSearchLoading) {
        this.packagePageIndex = 1
        this.allPackages = []
        this.searchPackageList = [] // 未选套餐 搜索框的列表
        this.getPackagesList()
      }
    }
  }
}

/* 体检预约，登记和个人信息修改 三个页面，通用表单校验 */
export const validate = {
  data () {
    const checkIdno = (rule, value, callback) => {
      // 身份证为空时，也可以通过校验
      let reg2 = true
      if (!value) {
        reg2 = false
      } else if (value.length == 15 || value.length == 18) {
        reg2 = true
      }
      if (reg2 && this.patientInfoForm.boCertificatesType == 1) {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!reg.exec(value)) {
          callback(new Error('请输入正确的身份证号'))
        }
      } else if (reg2 && this.patientInfoForm.boCertificatesType == 5) {
        const reg1 = /^[a-zA-Z0-9]{3,21}$/
        const reg2 = /^(P\d{7})|(G\d{8})$/
        if (!reg1.exec(value) && !reg2.exec(value)) {
          callback(new Error('请输入正确的护照号'))
        }
      } else if (reg2 && this.patientInfoForm.boCertificatesType == 2 && this.patientInfoForm.boCertificatesType == 3) {
        const reg = /^[a-zA-Z0-9]{7,21}$/
        if (!reg.exec(value)) {
          callback(new Error('请输入正确的证件号'))
        }
      } else if (reg2) {
        const reg = /^[a-zA-Z0-9]*$/
        if (!reg.exec(value)) {
          callback(new Error('证件号只允许输入英文和数字'))
        }
      }
      callback()
    }
    const checkPhone = (rule, value, callback) => {
      const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/ //  带杠的电话号码
      const reg2 = /^1[3|4|5|7|8][0-9]{9}$/ // 手机号码
      const reg3 = /^[0-9]{11,12}$/ //  纯数字的电话号码
      if (!reg.test(value) && !reg2.test(value) && !reg3.test(value)) {
        callback(new Error('请输入手机号或者座机号'))
      }
      callback()
    }
    return {
      ruleValidate: {
        boName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        boIdNo: [
          { validator: checkIdno, trigger: 'blur' }
        ],
        boBirthday: [
          { required: true, message: '生日不能为空' }
        ],
        boChargeTypeId: [
          { required: true, message: '请选择费别' }
        ],
        boSex: [
          { required: true, message: '请选择性别' }
        ],
        // boMobile: [
        //   { required: true, message: '联系方式不能为空', trigger: 'blur' },
        //   { validator: checkPhone, trigger: 'blur' }
        // ],
        boVisitCardNumber: [
          { pattern: /^[0-9a-zA-Z]+$/, message: '请输入数字或英文', trigger: 'blur' }
        ],
        boCategoryId: [
          { required: true, message: '请选择体检类型' }
        ]
      }, // 各别字段校验规则
      patientInfoForm: {
        boCertificatesType: '1'
      }, // 表单双向绑定的字段
      allPackages: [], // 用于保存所有套餐项目
      userPickPackageId: '', // 未选套餐单选值保存
      userPickPackageName: '', // 已选套餐标签值
      groupsList: [], // 搜索分组下拉框数据
      pickProjectsTableData: [], // 已选项目表格数据
      emptyText: '暂无数据', // 已选项目表格的提示文字
      getInfoByEnter: false, // 判断是否是回车导入的信息标志，主要用于身份证失焦时，重新根据性别请求套餐，造成多余的请求
      importData: false, // 判断是否是导入的信息标志, 主要用于禁止一些输入框和选择框
      packageTimer: null, // 搜索套餐节流定时器
      projectTimer: null, // 搜索项目组合节流定时器
      unitTimer: null, // 搜索单位节流定时器
      packageSearchLoading: false, // 防多次搜索套餐
      projectSearchLoading: false, // 防多次搜索项目组合
      unitSearchLoading: false, // 防多次搜索单位
      searchPackageList: [], // 搜索套餐下拉框数据
      searchProList: [], // 搜索项目组合下拉框数据
      unitsList: [], // 搜索单位下拉框数据
      packagePages: 1,
      packagePageIndex: 1,
      packagePageSize: 15,
      isPackageMore: false, // 翻页是否有套餐数据 false-代表还有更多页， true-没有更多了
      isProjectMore: false, //  翻页是否有项目数据
      isAutoClear: true, // 保存后自动清空页面信息
      multiplyPackage: false // 是否叠加套餐变自选
    }
  }
}

/* 体检预约，登记和个人信息修改 三个页面，通用方法 */
export const commonFunc = {
  methods: {
    // 读取身份证
    readIdCard () {
      let url = `http://127.0.0.1:8989/api/ReadMsg`
      this.scanLoading = true
      jsonp(url, { timeout: 3000 }, (_err, data) => {
        // console.log(_err)
        // console.log(data)
        this.scanLoading = false
        if (data != undefined && data != null) {
          if (data.retcode == '0x90 0x1') {
            this.patientInfoForm.boCertificatesType = '1'
            this.patientInfoForm.boIdNo = data.cardno
            this.boPic = `data:image/jpg;base64,${data.photobase64}`
            this.patientInfoForm.boName = data.name
            this.patientInfoForm.boAddress = data.address
            this.getAgeAndBirthday()
          } else if (data.retcode == '0x41') {
            this.$Message.error('身份证读取失败，请稍后尝试')
          } else if (data.retcode == '0x1') {
            this.$Message.error('读卡器服务' + data.retmsg)
          }
        } else {
          this.$Modal.info({
            title: '和湛科技体检系统',
            content: `检测到该电脑未安装身份证读卡器驱动，请联系管理员安装相关驱动。<a href="./plugins/readIdCard3.0.9-2.zip" target="_blank" download="readIdCard3.0.9-2.zip">点击此处下载身份证读卡器驱动</a>`
          })
        }
      })
    },
    // 分页获取所有 未选套餐
    getPackagesList (query = '') {
      if (this.isPackageMore) return false
      if (this.packageSearchLoading) return false
      this.packageSearchLoading = true
      let pagination = {
        page: this.packagePageIndex,
        size: this.packagePageSize
      }
      let params = {
        paPackageName: query,
        paSex: this.patientInfoForm.boSex
      }
      getBookingPackage(pagination, params).then(res => {
        let result = res.data
        if (result.code == 0) {
          // console.log(result.data);
          result.data.records.forEach(item => {
            this.allPackages.push(item)
            if (query != '') {
              this.searchPackageList.push(item)
            }
          })
          // 判断当前页数和总页数是否相等，如果相同就不需要再请求了
          this.packagePageIndex == result.data.pages ? this.isPackageMore = true : this.isPackageMore = false
        } else {
          this.$Message.error(result.message)
        }
        this.packageSearchLoading = false
      }).catch(err => {
        console.log(err)
        this.packageSearchLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    // 灰掉所有勾选框 - 未选套餐
    grayAllPackage () {
      this.allPackages.forEach(item => {
        item.gray = true
      })
    },
    // 恢复所有勾选框可勾选状态 - 未选套餐
    delGrayOffAllPackage () {
      this.allPackages.forEach(item => {
        item.gray = false
      })
    }
  }
}

/* 体检登记和个人信息修改 两个页面，通用方法 */
export const selectUnit = {
  methods: {
    getUnits (query = '') {
      if (this.importData) return
      this.unitSearchLoading = true
      this.unitTimer && clearTimeout(this.unitTimer)
      this.unitTimer = setTimeout(() => {
        let params = {
          boUnitName: query
        }
        listByName(params).then(({ data }) => {
          if (data.code === 0) {
            this.unitsList = data.data
          } else {
            this.$Message.error(result.message)
          }
          this.unitSearchLoading = false
        }).catch(err => {
          console.log(err)
          this.unitSearchLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }, 300)
    },
    //  选中单位后
    changeUnit (e) {
      if (e == undefined) return
      this.patientInfoForm.boUnitName = e.label
      this.patientInfoForm.boUnitId = e.value

      //  根据选中单位，带出相关单位信息
      let arr = this.unitsList.filter((item, index) => {
        return item.boUnitId == e.value
      })
      if (this.patientInfoForm.boIsUnit == 0) {
        this.patientInfoForm.boIsUnit = '1'
      }
      this.patientInfoForm.boChargeTypeId = arr[0].boChargeTypeId // 费别
      this.patientInfoForm.boPriorityId = arr[0].boPriorityId //  体检优先级
      this.patientInfoForm.boSourceId = arr[0].boSourceId //  人员来源
      this.patientInfoForm.boCategoryId = arr[0].boCategoryId // 体检类型
      this.getGroups()
    },
    //  清空单位后
    clearUnit () {
      this.patientInfoForm.boUnitName = ''
      this.patientInfoForm.boUnitCode = ''
      this.patientInfoForm.boUnitId = ''
      this.patientInfoForm.boGroupId = ''
      this.patientInfoForm.boIsUnit = '0'
      this.unitsList = []
      this.groupsList = []
      this.unitDeptList = []
      this.selectDeptArr = []
    }
  }
}

/* 体检登记和个人信息修改 两个页面，通用方法 */
export const selectProject = {
  methods: {
    //  搜索项目组合
    searchProject (query) {
      console.log(query)
      if (query !== undefined || query !== '' || query !== null) {
        //  节流，因输入值改变而频繁发请求，延迟执行请求
        this.projectTimer && clearTimeout(this.projectTimer)
        this.projectTimer = setTimeout(() => {
          if (!this.projectSearchLoading) {
            this.isProjectMore = false
            this.comboPageIndex = 1
            this.paDeptId = 'all'
            this.projects = [] //  未选项目 checkbox列表
            this.searchProList = [] //  未选项目 搜索框的列表
            this.tempPickLength = 0
            this.showItem(query)
            if (+this.patientInfoForm.boIsUnit) {
              this.grayOff(this.pickProjectsTableData)
            }
          }
        }, 300)
      }
    },
    selectProject (value, lable) {
      //  如果已选项目中已有项目，则不添加新的项目，去重
      for (let i = 0; i < this.pickProjectsTableData.length; i++) {
        if (this.pickProjectsTableData[i].paId == value) return
      }
      if (value != undefined || value != '') {
        this.pickProjects.push(value)
        this.changeProject()
      }
      this.$refs.projectInputDrop.resetOptions()
    },
    clearProject () {
      if (!this.projectSearchLoading) {
        this.comboPageIndex = 1
        this.paDeptId = 'all'
        this.projects = [] //  未选项目 checkbox列表
        this.searchProList = [] //  未选项目 搜索框的列表
        this.tempPickLength = 0
        this.showItem()
      }
    }
  }
}
