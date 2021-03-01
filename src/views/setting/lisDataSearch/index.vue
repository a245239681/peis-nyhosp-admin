<template>
  <div class="lis-data-search-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">Lis数据查询</span>
        <div class="title-right-tool">
          <Form :model="formData"
                :label-width="80"
                ref="form"
                inline
                label-position="right">
            <FormItem label="条码号">
              <Input v-model="formData.barcode"
                     size="small"
                     placeholder="请输入条码号"></Input>
            </FormItem>
            <FormItem label="查询类型">
              <Select v-model="formData.type"
                      style="min-width: 160px"
                      size="small">
                <Option value="1"
                        key="1">申请单数据</Option>
                <Option value="2"
                        key="2">Lis检验结果</Option>
              </Select>
            </FormItem>
          </Form>

          <Button type="primary"
                  style="margin-left: 8px;"
                  @click="getData"
                  :loading="isLoading">查询</Button>
          <Button type="error"
                  style="margin-left: 8px;"
                  @click="resetHandle">清空</Button>
        </div>
      </div>
      <div class="page-body clearfix">
        <div class="main-wrapper"
             v-html="jsonData"
             v-if="jsonData"></div>
        <p v-else
           class="no-data">{{isLoading ? '加载中' : '暂无数据'}}</p>
      </div>
    </Card>
  </div>
</template>
<script>
import { lisData } from '@/api/setting'

export default {
  name: 'lisDataSearch',
  data () {
    return {
      formData: {},
      isLoading: false,
      jsonData: ''
    }
  },
  mounted () {
  },
  methods: {

    getData () {
      if (this.isLoading) return
      if (!this.formData.barcode) {
        this.$Message.info('请输入条码号')
        return false
      }
      if (!this.formData.type) {
        this.$Message.info('请选择查询类型！')
        return false
      }

      this.isLoading = true
      lisData(this.formData).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          const str = this.jsonFormat(data.data)
          this.jsonData = str

        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    jsonFormat (str) {
      // 设置缩进为2个空格
      str = JSON.stringify(JSON.parse(str), null, 2);
      str = str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    },

    resetHandle () {
      this.formData = {}
      this.jsonData = ''
    }
  }
}
</script>
<style lang="less">
.lis-data-search-wrapper {
  width: 100%;
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
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
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
  .no-data {
    padding: 50px 0;
    text-align: center;
    width: 100%;
    font-size: 14px;
    color: #888;
  }
  .main-wrapper {
    width: 100%;
    height: 71vh;
    overflow-x: hidden;
    overflow-y: auto;
    .string {
      color: green;
    }

    .number {
      color: darkorange;
    }

    .boolean {
      color: blue;
    }

    .null {
      color: magenta;
    }

    .key {
      color: red;
    }
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
</style>
