<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="操作记录"
           class="handle-log-edit-wrapper">
      <div class="modal-body">
        <Timeline v-if="handleLogList.length > 0">
          <TimelineItem v-for="(item, index) in handleLogList"
                        :key="index">
            <p class="item">{{item.comboName}}</p>
            <p class="content">
              <span class="time">{{item.dateTime}}</span>
              <span class="name">{{item.doctor}}</span>
            </p>
          </TimelineItem>
        </Timeline>
        <div class="no-data"
             v-else>暂无操作记录</div>
      </div>
      <div slot="footer">
        <Button @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      isLoading: false,
      handleLogList: []
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
  },
  mounted () {

  },
  methods: {
    closeModal () {
      this.handleLogList = []
      this.$emit('close')
    },

    getTimeList (arr) {
      if (arr.length === 0) {
        this.handleLogList = []
      } else {
        this.handleLogList = arr
      }
    }
  }
}
</script>
<style lang="less">
.handle-log-edit-wrapper {
  .modal-body {
    width: 100%;
    max-height: 600px;
    padding: 0 20px;
    overflow: hidden;
    overflow-y: auto;
    .item {
      font-size: 14px;
      font-weight: bold;
      color: #252525;
    }
    .content {
      display: flex;
      align-items: center;
      margin-top: 10px;
      font-size: 14px;
      justify-content: space-between;
    }
    .no-data {
      width: 100%;
      height: 300px;
      text-align: center;
      line-height: 300px;
    }
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: #eee;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-corner {
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #e8e8e8;
    }
  }
}
</style>