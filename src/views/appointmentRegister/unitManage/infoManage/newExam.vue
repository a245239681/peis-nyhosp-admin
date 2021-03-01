<template>
  <div class="new-exam-expand-wrapper"
       v-if="row.unitVisit">
    <div class="exam-info">
      <div>
        <!-- <span>第{{examTime}}次体检</span>/<span>{{date}}</span> -->
        <span>第{{examTime}}次体检</span>
      </div>
      <div style="margin-left: 30px;">
        体检状态：<span v-if="examStatus == '0'">未完成</span>
        <span v-else>已完成</span>
      </div>
    </div>
    <div class="exam-action">
      <Button type="default"
              @click="examComplete"
              size="small">体检完成</Button>
      <Button type="default"
              style="margin-left: 8px;"
              @click="addExamHandle"
              size="small">转档</Button>
      <Button type="default"
              style="margin-left: 8px;"
              @click="jumpUnitPerson"
              size="small">编辑人员</Button>
      <Button type="default"
              style="margin-left: 8px;"
              @click="jumpUnitGroup"
              size="small">编辑分组信息</Button>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { addExam, finishExam } from '@/api/appointmentUnitManage.js'
export default {
  props: {
    row: Object
  },
  data () {
    return {
      date: '',
      examTime: 1,
      examStatus: '0'
    }
  },
  mounted () {
    console.log(this.row)
    if (this.row.unitVisit) {
      this.date = moment(this.row.unitVisit.boRegisterDate).format('YYYY-MM-DD')
      this.examTime = this.row.unitVisit.boUnitVisitSn
      this.examStatus = this.row.unitVisit.boIsComplete
    }
  },
  methods: {
    examComplete () {
      let params = {
        boUnitId: this.row.boId
      }
      finishExam(params).then(({ data }) => {
        if (data.code == 0) {
          this.$Message.success('操作成功！')
          this.$emit('updateList')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    addExamHandle () {
      this.$emit('turnShift')
      // let params = {
      //   boUnitId: this.row.boId
      // }
      // addExam(params).then(({ data }) => {
      //   if (data.code == 0) {
      //     this.$Message.success('新增成功！')
      //     this.$emit('updateList')
      //   } else {
      //     this.$Message.error(data.message)
      //   }
      // }).catch(err => {
      //   this.$Message.error('网络不稳定，请稍后重试')
      // })
    },
    jumpUnitPerson () {
      if (this.row.boStatus == 1) {
        this.$Message.warning('该单位为停用状态')
        return
      }
      this.$router.push({
        name: 'unitPersonManage',
        params: {
          unitName: this.row.boName,
          unitId: this.row.boId,
          unitVisit: this.examTime
        }
      })
    },
    jumpUnitGroup () {
      if (this.row.boStatus == 1) {
        this.$Message.warning('该单位为停用状态')
        return
      }
      this.$router.push({
        name: 'groupManage',
        params: {
          unitName: this.row.boName,
          unitId: this.row.boId,
          unitVisit: this.examTime
        }
      })
    }
  },
}
</script>
<style lang="less">
.new-exam-expand-wrapper {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  .exam-info {
    display: flex;
    align-items: center;
  }
  .exam-action {
    margin-left: 50px;
  }
}
</style>
