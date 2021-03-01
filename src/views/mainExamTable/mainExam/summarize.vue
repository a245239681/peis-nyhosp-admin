<template>
  <div>
    <Modal
      v-model="isVisible"
      title="历史综述信息"
      width="900"
      @on-ok="ok"
      @on-cancel="cancel"
      class="history-summarize-wrapper"
    >
      <div class="info">
        <span>体检编号：{{ boPeId }}</span>
        <span>姓名： {{ boName }}</span>
        <span>性别：{{ boSex }}</span>
      </div>
      <div class="table">
        <Table
          :columns="columns"
          :data="tableData"
          hight="600"
          :loading="isLoading"
        ></Table>
      </div>
      <div slot="footer">
        <Button
          type="primary"
          @click="ok"
        >确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { historyReviewList } from '@/api/mainExam.js'
export default {
  name: 'summarize',
  props: {
    visible: Boolean,
    name: [String, Number],
    peId: [String, Number],
    sex: [String, Number],
    visit: [String, Number]
  },
  data () {
    return {
      columns: [
        {
          title: '体检次数',
          key: 'inVisitSn',
          minWidth: 90,
          align: 'center'
        },
        {
          title: '总检日期',
          key: 'date',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '总检医生',
          key: 'doctor',
          minWidth: 70,
          align: 'center'
        },
        {
          title: '综述',
          key: 'inContent',
          type: 'html',
          minWidth: 300,
          align: 'left'
        }
      ],
      tableData: [],
      isLoading: false
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {}
    },
    boName: {
      get: function () {
        return this.name
      },
      set: function () {}
    },
    boPeId: {
      get: function () {
        return this.peId
      },
      set: function () {}
    },
    boSex: {
      get: function () {
        return this.sex
      },
      set: function () {}
    },
    boVisitSn: {
      get: function () {
        return this.visit
      },
      set: function () {}
    }
  },
  mounted () {
    // console.log(this.isVisible)
  },
  methods: {
    getList () {
      // console.log("查询历次综述");
      let params = {
        boPeId: this.boPeId ? this.boPeId : '',
        boVisitSn: this.boVisitSn ? this.boVisitSn : ''
      }
      this.isLoading = true
      historyReviewList(params)
        .then(({ data }) => {
          this.isLoading = false
          if (data.code == 0) {
            this.tableData = data.data
            console.log(this.tableData)
            this.tableData.forEach(item => {
              if (item.inContent) {
                item.inContent = item.inContent.replace(/\n/g, '<br/>')
              }
            })
            console.log(this.tableData)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    ok () {
      // this.$Message.info('Clicked ok');
      this.$emit('close')
    },
    cancel () {
      // this.$Message.info('Clicked cancel');
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
.history-summarize-wrapper {
  .ivu-modal-header-inner {
    position: relative;
    padding-left: 8px;
    font-weight: bold;
    &::before {
      content: "";
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
  .info {
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    span {
      margin-right: 20px;
    }
  }
  .table {
    padding: 5px 0;
    .ivu-table-cell {
      max-height: 400px;
      overflow-y: auto;
    }
  }
}
</style>
