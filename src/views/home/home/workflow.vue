<template>
  <div ref="flow"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import { pageUrlList } from '@/api/home'
export default {
  name: 'serviceRequests',
  data () {
    return {
      flow: null,
      bookingPic: require('@/assets/images/workflow/booking.png'),
      registerPic: require('@/assets/images/workflow/register.png'),
      unitPic: require('@/assets/images/workflow/unit.png'),
      groupPic: require('@/assets/images/workflow/group.png'),
      personPic: require('@/assets/images/workflow/personal.png'),
      examPic: require('@/assets/images/workflow/exam.png'),
      mainExamPic: require('@/assets/images/workflow/mainExam.png'),
      guidePic: require('@/assets/images/workflow/guide.png'),
      barcodePic: require('@/assets/images/workflow/barcode.png'),
      reportPic: require('@/assets/images/workflow/report.png'),
      payPic: require('@/assets/images/workflow/pay.png'),
      urlList: []
    }
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
  },
  methods: {
    resize () {
      this.flow.resize()
    },
    getUrlList () {
      let params = {
        userId: this.userInfo.userId
      }
      pageUrlList(params).then(({ data }) => {
        if (data.code == 0) {
          this.urlList = data.data
        }
      })
    },
    isJumpPage (url) {
      let btn = false
      for (let i = 0; i < this.urlList.length; i++) {
        if (this.urlList[i].poPageUrl == url) {
          btn = true
          break;
        }
      }

      if (btn) {
        this.$router.push({ path: url })
      } else {
        this.$Message.error('您没有访问该页面的权限！')
      }
    }
  },
  mounted () {
    this.getUrlList()
    const option = {
      title: {
        text: '体检流程'
      },
      tooltip: {},
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          symbol: 'roundRect',
          symbolSize: 70,
          // roam: true,
          tooltip: {
            show: false
          },
          label: {
            normal: {
              show: true,
              position: ['10%', '110%'],
              color: '#000'
            }
          },
          itemStyle: {
            color: 'lightblue',
          },
          data: [{
            name: '体检预约',
            x: 0,
            y: 100,
            symbol: `image://${this.bookingPic}`
          }, {
            name: '体检登记',
            x: 200,
            y: 100,
            symbol: `image://${this.registerPic}`
          }, {
            name: '单位管理',
            x: 0,
            y: 300,
            symbol: `image://${this.unitPic}`
          }, {
            name: '单位分组',
            x: 0,
            y: 500,
            symbol: `image://${this.groupPic}`
          }, {
            name: '单位预登记',
            x: 200,
            y: 500,
            symbol: `image://${this.personPic}`
          }, {
            name: '正式登记',
            x: 200,
            y: 300,
            symbol: `image://${this.registerPic}`
          }, {
            x: 300,
            y: 100,
            symbolSize: 4,
            itemStyle: {
              color: '#d4d4d4',
            },
          }, {
            x: 300,
            y: 300,
            symbolSize: 4,
            itemStyle: {
              color: '#d4d4d4',
            },
          }, {
            x: 300,
            y: 200,
            symbolSize: 4,
            itemStyle: {
              color: '#d4d4d4',
            },
          }, {
            x: 400,
            y: 200,
            symbolSize: 4,
            itemStyle: {
              color: '#d4d4d4',
            },
          }, {
            name: '打印指引单',
            x: 400,
            y: 100,
            symbol: `image://${this.guidePic}`
          }, {
            name: '打印条码',
            x: 400,
            y: 300,
            symbol: `image://${this.barcodePic}`
          }, {
            name: '体检缴费',
            x: 400,
            y: 500,
            symbol: `image://${this.payPic}`
          }, {
            x: 500,
            y: 100,
            symbolSize: 4,
            itemStyle: {
              color: '#d4d4d4',
            },
          }, {
            x: 500,
            y: 100,
            symbolSize: 4,
            itemStyle: {
              color: '#d4d4d4',
            },
          }, {
            x: 500,
            y: 300,
            symbolSize: 4,
            itemStyle: {
              color: '#d4d4d4',
            },
          }, {
            x: 500,
            y: 500,
            symbolSize: 4,
            itemStyle: {
              color: '#d4d4d4',
            },
          }, {
            name: '分诊工作台',
            x: 600,
            y: 300,
            symbol: `image://${this.examPic}`
          }, {
            name: '总检工作台',
            x: 750,
            y: 300,
            symbol: `image://${this.mainExamPic}`
          }, {
            name: '打印体检报告',
            x: 900,
            y: 300,
            symbol: `image://${this.reportPic}`
          },],
          links: [{
            source: '体检预约',
            target: '体检登记'
          }, {
            source: '单位管理',
            target: '单位分组'
          }, {
            source: '单位分组',
            target: '单位预登记'
          }, {
            source: '单位预登记',
            target: '正式登记'
          }, {
            source: '体检登记',
            target: '6'
          }, {
            source: '正式登记',
            target: '7'
          }, {
            source: '6',
            target: '8'
          }, {
            source: '7',
            target: '8'
          }, {
            source: '8',
            target: '9'
          }, {
            source: '打印指引单',
            target: '9',
            lineStyle: {
              type: 'dashed'
            }
          }, {
            source: '打印条码',
            target: '9',
            lineStyle: {
              type: 'dashed'
            }
          }, {
            source: '体检缴费',
            target: '9',
            lineStyle: {
              type: 'dashed'
            }
          }, {
            source: '打印指引单',
            target: '14'
          }, {
            source: '打印条码',
            target: '15'
          }, {
            source: '体检缴费',
            target: '16'
          }, {
            source: '14',
            target: '15'
          }, {
            source: '14',
            target: '16'
          }, {
            source: '15',
            target: '分诊工作台'
          }, {
            source: '分诊工作台',
            target: '总检工作台'
          }, {
            source: '总检工作台',
            target: '打印体检报告'
          }],
          lineStyle: {
            normal: {
              opacity: 0.5,
              width: 4,
            }
          }
        }
      ]
    };
    this.$nextTick(() => {
      this.flow = echarts.init(this.$refs.flow)
      this.flow.setOption(option)
      on(window, 'resize', this.resize)
      let that = this;
      this.flow.on('click', function (params) {
        if (params.name === '体检预约') {
          let pageUrl = '/appointmentRegister/personalAppointment'
          that.isJumpPage(pageUrl)
        } else if (params.name === '体检登记') {
          let pageUrl = '/appointmentRegister/personalRegister'
          that.isJumpPage(pageUrl)
        } else if (params.name === '单位管理') {
          let pageUrl = '/unitManage/infoManage'
          that.isJumpPage(pageUrl)
        } else if (params.name === '单位分组') {
          let pageUrl = '/unitManage/groupManage'
          that.isJumpPage(pageUrl)
        } else if (params.name === '单位预登记') {
          let pageUrl = '/unitManage/unitPersonManage'
          that.isJumpPage(pageUrl)
        } else if (params.name === '正式登记') {
          let pageUrl = '/unitManage/unitRegister'
          that.isJumpPage(pageUrl)
        } else if (params.name === '打印指引单') {
          let pageUrl = '/appointmentRegister/guideSheetManage'
          that.isJumpPage(pageUrl)
        } else if (params.name === '打印条码') {
          let pageUrl = '/appointmentRegister/barcodeManage'
          that.isJumpPage(pageUrl)
        } else if (params.name === '分诊工作台') {
          let pageUrl = '/examTable/recordResult'
          that.isJumpPage(pageUrl)
        } else if (params.name === '总检工作台') {
          let pageUrl = '/mainExamTable/mainExam'
          that.isJumpPage(pageUrl)
        } else if (params.name === '打印体检报告') {
          let pageUrl = '/appointmentRegister/examProgressManage'
          that.isJumpPage(pageUrl)
        } else if (params.name === '体检缴费') {
          let pageUrl = '/balance/personBalance'
          that.isJumpPage(pageUrl)
        }
      });
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
