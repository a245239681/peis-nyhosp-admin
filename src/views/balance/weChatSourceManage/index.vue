<template>
  <div class="wechat-source-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">小程序号源管理</span>
        <div class="title-right-tool">
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">批量添加</Button>
          <!-- <Button type="error"
                  style="margin-left: 8px;"
                  @click="deleteAllHandle"
                  :disabled="selections.length == 0">批量删除</Button> -->
        </div>
      </div>
      <div class="page-body clearfix flex">
        <div class="calendar"
             style="width: 70%;">
          <FullCalendar style="width: 100%;"
                        ref="fullCalendar"
                        defaultView="dayGridMonth"
                        locale="zh-cn"
                        :plugins="calendarPlugins"
                        :weekends="calendarWeekends"
                        :events="getCalendarEvents"
                        :eventLimit="true"
                        @dateClick="handleDateClick"
                        @eventClick="handleEventClick"
                        @changeMonth="next" />
        </div>
        <div class="setContainer"
             style="width: 29%;">
          <div class="container-in"
               :class="clickShow?'block':''">
            <div slot="title"
                 class="set-title">
              <span class="date-title">{{cdNoData.strDate}}</span>
              <!--            <span class="date-title">2020</span>
              <span>年</span>
              <span class="date-title">02</span>
              <span>月</span>
              <span class="date-title">02</span>
              <span>日</span> -->
            </div>
            <div class="form">
              <Form :model="sourceItem"
                    :label-width="80"
                    :rules="ruleCustom"
                    ref="sourItem">
                <Form-item label="总号源"
                           prop="all">
                  <Input v-model="sourceItem.all"
                         placeholder="请输入号源"
                         number
                         @on-change="getWith"></Input>
                </Form-item>
                <FormItem label="已使用"
                          prop="run">
                  <Input v-model="sourceItem.run"
                         placeholder="请输入号源"
                         number
                         @on-change="getWith"></Input>
                </FormItem>
                <FormItem label="剩余号源"
                          prop="with">
                  <Input v-model="sourceItem.with"
                         disabled
                         placeholder="请输入号源"
                         number></Input>
                </FormItem>
              </Form>

              <div class="set-btn">
                <Button type="primary"
                        @click="hold">保存本日号源</Button>

                <Button type="warning"
                        style="margin-left: 16px;"
                        @click="delect">删除号源</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>

import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Edit from './edit.vue'

import { wechatSourceList, wechatSourceUpdate, wechatSourceDelete } from '@/api/weChatSourceManage'
import moment from 'moment'

export default {
  name: 'wechatSourceManage',
  components: {
    Edit, FullCalendar
  },
  data () {
    const validateNum = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        return callback(new Error('请输入数字！'))
      }
      callback()
    }

    return {
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      isLoading: false,
      calendarPlugins: [ // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: [ // initial event data
        // {
        //   title: 'Event Now',
        //   start: new Date(),
        //   color: '#A61000'
        // }
      ],
      calendarApi: null,
      cdNoData: {
        strDate: '',
        initDate: '',
        cdOrgId: '',
        cdId: ''
      },
      sourceItem: {
        all: '',
        run: '',
        with: ''
      },
      clickShow: false,
      info: {},
      ruleCustom: {
        all: [
          { validator: validateNum, trigger: 'blur' }
        ],
        run: [
          { validator: validateNum, trigger: 'blur' }
        ],
        with: [
          { validator: validateNum, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initSourceNo()
  },
  mounted () {
    this.calendarApi = this.$refs.fullCalendar.getApi()
  },
  methods: {
    getWith () {
      this.sourceItem.with = parseInt(this.sourceItem.all) - parseInt(this.sourceItem.run)
      if (isNaN(this.sourceItem.with)) {
        this.sourceItem.with = ''
      }
    },
    async initSourceNo () {
      // let that = this
      // 获取当月数据
      // let params = {
      //   dayStart: moment().startOf('month').format('YYYY-MM-DD'),
      //   dayEnd: moment().endOf('month').format("YYYY-MM-DD")
      // }
      // 获取最近一年数据
      let params = {
        dayStart: moment().subtract(6, 'month').format('YYYY-MM-DD'),
        dayEnd: moment().add(6, 'month').format('YYYY-MM-DD')
      }
      let res = await wechatSourceList(params)
      console.log(res)
      if (res.data.code == 0) {
        res.data.data.forEach((item, index) => {
          this.calendarEvents.push(
            {
              title: `号源:${item.cdUseSourceNo}/${item.cdTotalSourceNo}`,
              start: item.cdDay,
              allDay: true,
              cdId: item.cdId,
              cdOrgId: item.cdOrgId
            }
          )
        })
      }
      this.calendarApi.refetchEvents()
    },
    getCalendarEvents (info, successCallback, failureCallback) {
      const events = [
        ...this.calendarEvents
      ]
      successCallback(events)
    },
    handleDateClick (arg) {
      console.log(arg)

      //限制时间
      if (moment(arg.date).valueOf() < moment().startOf('day').valueOf()) {
        this.$Message.error('该时间段无法新增/修改号源！')
        return;
      }

      const obj = this.calendarEvents.find((item) => {
        return item.start == arg.dateStr
      })
      if (obj && Object.keys(obj).length > 0) {
        // 已存在，修改
        let cdUseSourceNo = obj.title.substring(obj.title.indexOf(':') + 1, obj.title.indexOf('/'))
        let cdTotalSourceNo = obj.title.substring(obj.title.indexOf('/') + 1)
        let cdRemainSourceNo = parseInt(cdTotalSourceNo) - parseInt(cdUseSourceNo)
        this.sourceItem = {
          all: cdTotalSourceNo,
          run: cdUseSourceNo,
          with: cdRemainSourceNo
        }
        this.cdNoData = {
          initDate: moment(arg.date).format('YYYY-MM-DD'),
          strDate: moment(arg.date).format('YYYY年MM月DD日'),
          cdOrgId: obj.cdOrgId,
          cdId: obj.cdId
        }
      } else {
        // 新增
        this.sourceItem = {
          all: '',
          run: '',
          with: ''
        }
        this.cdNoData = {
          initDate: moment(arg.date).format('YYYY-MM-DD'),
          strDate: moment(arg.date).format('YYYY年MM月DD日')
        }
      }
      this.clickShow = true
      // this.calendarApi.refetchEvents()
    },
    handleEventClick (info) {
      console.log(info)
      //限制时间
      if (moment(info.event.start).valueOf() < moment().startOf('day').valueOf()) {
        this.$Message.error('该时间段无法新增/修改号源！')
        return;
      }

      this.calendarEvents.find((item) => {
        if (item.start == moment(info.event.start).format('YYYY-MM-DD')) {
          info.event.cdId = item.cdId
          info.event.cdOrgId = item.cdOrgId
        }
      })
      this.cdNoData = {
        initDate: moment(info.event.start).format('YYYY-MM-DD'),
        strDate: moment(info.event.start).format('YYYY年MM月DD日'),
        cdOrgId: info.event.cdOrgId,
        cdId: info.event.cdId
      }
      // this.setDate = moment(info.event.start).format("YYYY年MM月DD日")
      this.clickShow = true
      let title = info.event.title
      let cdUseSourceNo = title.substring(title.indexOf(':') + 1, title.indexOf('/'))
      let cdTotalSourceNo = title.substring(title.indexOf('/') + 1)
      let cdRemainSourceNo = parseInt(cdTotalSourceNo) - parseInt(cdUseSourceNo)
      this.sourceItem = {
        all: cdTotalSourceNo,
        run: cdUseSourceNo,
        with: cdRemainSourceNo
      }


    },
    getList () {

    },
    next () {

    },
    add () {
      this.editModalVisible = true
      this.modalTitle = 0
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
      })
    },
    edit (row) {
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    async delect () {
      let r = confirm('确认删除号源吗!')
      if (r) {
        let cdIndex
        this.calendarEvents.find((item, index) => {
          if (item.cdId == this.cdNoData.cdId) {
            console.log(item.cdId, this.cdNoData.cdId);
            cdIndex = index;
          }
        })
        const params = {
          cdId: this.cdNoData.cdId
        }
        let res = await wechatSourceDelete(params)
        if (res.data.code == 0) {
          this.calendarEvents.splice(cdIndex, 1)
          this.calendarApi.refetchEvents()
          this.$Message.success('删除成功！')
          // this.$router.go(0)
        }
      } else {
        return;
      }
    },
    async hold () {
      if (parseInt(this.sourceItem.run) > parseInt(this.sourceItem.all)) {
        this.$Message.error('已使用号源不能大于总号源！')
        return
      }
      //判断是否为数字
      var reg = /^[0-9]+.?[0-9]*$/;
      if (!reg.test(this.sourceItem.all) || !reg.test(this.sourceItem.run) || !reg.test(this.sourceItem.with)) {
        this.$Message.error('请输入号源数！')
        return
      }

      this.sourceItem.with = parseInt(this.sourceItem.all) - parseInt(this.sourceItem.run)
      const params = {
        cdId: this.cdNoData.cdId || '',
        cdDay: this.cdNoData.initDate || '',
        cdTotalSourceNo: parseInt(this.sourceItem.all),
        cdUseSourceNo: parseInt(this.sourceItem.run),
        cdRemainSourceNo: parseInt(this.sourceItem.with),
        cdSource: '1',
        cdStatus: ''
      }
      console.log(params)
      let res = await wechatSourceUpdate(params)
      if (res.data.code == 0) {
        console.log(res)
        if (params.cdId) {
          this.calendarEvents.find((item, index) => {
            if (params.cdId == item.cdId) {
              item.title = `号源:${params.cdUseSourceNo}/${params.cdTotalSourceNo}`
            }
          })

          this.calendarApi.refetchEvents()
          this.$Message.success('更新成功！')
          // this.$router.go(0)
        } else {
          this.calendarEvents.push({
            title: `号源:${params.cdUseSourceNo}/${params.cdTotalSourceNo}`,
            start: params.cdDay,
            allDay: true,
            cdId: params.cdId,
            cdOrgId: params.cdOrgId
          })
          this.$Message.success('更新成功！')
          this.calendarApi.refetchEvents()
          this.$router.go(0)
        }
      }
    }
  }
}
</script>
<style lang="less">
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';

.wechat-source-manage-wrapper {
  // width: 100%;
  min-width: 1200px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-group {
      top: 0;
    }
  }
  .title-right-tool {
    display: flex;
    align-items: center;
  }
  .title {
    padding-left: 8px;
    position: relative;
    font-weight: bold;
    &::after {
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .ivu-btn-error[disabled] {
    color: #c5c8ce;
    background-color: #f7f7f7;
    border-color: #dcdee2;
  }
}
.fc-day {
  position: relative;
}
.fc-row {
  max-height: 100px !important;
}
.fc-content {
  padding: 25px 0;
  text-align: center;
}
.fc-today {
  background: none !important;
}
.fc-scroller {
  height: auto !important;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.setContainer {
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #e8eaec;
  position: relative;
}
.container-in {
  display: none;
}
.block {
  display: block;
}
.set-title {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8eaec;
  font-weight: 600;
  font-size: 24px;
}
.form {
  margin-top: 40px;
}
.date-title {
  color: #2d8cf0;
}
.set-btn {
  position: absolute;
  width: 220px;
  bottom: 20px;
  margin-left: 20%;
}
</style>
