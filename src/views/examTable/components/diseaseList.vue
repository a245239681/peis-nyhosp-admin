<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           v-dragForbid
           draggable
           @on-cancel="closeModal"
           width="850"
           :title="showTitle"
           class="disease-list-edit-wrapper">
      <div class="modal-body">
        <div class="disease-search-wrapper">
          <span>搜索模板：</span>
          <Select v-model="curSeletedItem"
                  filterable
                  :remote-method="searchMethod"
                  @on-change="selectItem"
                  clearable
                  :loading="searchLoading">
            <Option v-for="(option, index) in curSearchList"
                    :value="option"
                    :key="index">{{option}}</Option>
          </Select>
        </div>
        <div class="disease-list">
          <CheckboxGroup v-model="checkAllList"
                         @on-change="checkAllGroupChange">
            <Checkbox v-for="(item, index) in dataList"
                      size="large"
                      :key="index"
                      :label="item.resultDescription"></Checkbox>
          </CheckboxGroup>
        </div>
        <div class="disease-result">
          <div class="title">{{title == 0 ? '已选检查结果：' : '已选检验结果：'}}</div>
          <div class="cont">
            <!-- <span v-for="(item, index) in checkAllList"
                  :key="index">{{(checkAllList.length - 1) == index ? item : item + '、'}}</span> -->
            <Input v-model="checkList"
                   type="textarea"
                   style="width: 100%;"
                   :autosize="{minRows: 4,maxRows: 4}"
                   placeholder="" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { clinicalSave } from '@/api/dict_clinicalType.js'
import { getCode } from '@/api/common.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      dataList: [],
      curSearchList: [], // 搜索框列表
      checkAllList: [],
      isLoading: false,
      searchLoading: false,
      itemData: {},
      curSeletedItem: '', // 当前选中项
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '检查结果' : '检验结果');
    },
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    },
    checkList: {
      get: function () {
        if (this.checkAllList.length > 0) {
          let str = this.checkAllList.toString()
          return str.replace(/,/ig, '；')
        } else {
          return ''
        }

      },
      set: function (val) {
        if (val.trim() != '') {
          let arr = val.split('；')
          this.checkAllList = arr
        } else {
          this.checkAllList = []
        }
      }
    }
  },
  created () {
  },
  methods: {
    closeModal () {
      this.dataList = []
      this.checkAllList = []
      this.itemData = {}
      this.curSeletedItem = ''
      this.curSearchList = []
      this.$emit('close');
    },
    save () {
      let obj = {
        rowData: this.itemData,
        checkedList: this.checkAllList
      }
      this.$emit('updateCheckResult', obj)
      this.closeModal()
    },
    getItemList (obj) {
      console.log(obj)
      this.itemData = obj
      this.dataList = obj.curItem.paResultList
      if (Object.prototype.toString.call(obj.curItem.paRecord) != '[object Null]' && obj.curItem.paIsAbnormal) {
        this.checkAllList = obj.curItem.paRecord.split('；')
      } else {
        this.checkAllList = []
      }
    },
    selectItem (val) {
      if (val) {
        let btn = this.checkAllList.some(item => item === val)
        if (!btn) this.checkAllList.push(val)
      }
    },
    searchMethod (query) {
      if (query !== '') {
        this.searchLoading = true;
        setTimeout(() => {
          this.searchLoading = false;
          const list = this.dataList.map((item, index) => {
            return item.resultDescription
          });

          this.curSearchList = list.filter(item => item.indexOf(query) > -1);
        }, 200);
      } else {
        this.curSearchList = [];
      }
    },
    checkAllGroupChange (data) {
      return false
    }
  },
}
</script>
<style lang="less">
.disease-list-edit-wrapper {
  .modal-body {
    width: 100%;
    margin: 0 auto;
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
  .disease-search-wrapper {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
    & > span {
      width: 80px;
      color: #252525;
      font-size: 14px;
    }
  }
  .disease-list {
    width: 100%;
    height: 350px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8eaec;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 5px;
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
    .ivu-checkbox-group {
      width: 100%;
      column-gap: 0;
      column-count: 3;
    }
    .ivu-checkbox-wrapper {
      width: 260px;
      flex-shrink: 0;
      span {
        color: #252525;
      }
    }
  }
  .ivu-input[disabled] {
    color: #252525;
  }
  .disease-result {
    width: 100%;
    line-height: 1.4;
    font-size: 14px;
    color: #252525;
    margin-top: 15px;
    display: flex;
    .title {
      width: 100px;
      flex-shrink: 0;
      font-size: 14px;
      font-weight: bold;
      line-height: 2.2;
    }
    .cont {
      flex: 1;
      word-break: break-all;
    }
  }
}
</style>