<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="module-manage-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="110"
              ref="form"
              label-position="right">
          <FormItem label="模板名称">
            <Input v-model="formData.name"
                   size="small" />
          </FormItem>
          <FormItem label="模板类型">
            <Select v-model="formData.type"
                    @on-change="moduleTypeChange"
                    size="small">
              <Option v-for="item in moduleTypeDict"
                      :value="item.code"
                      :key="item.code"
                      :label="item.name">
                <span slot>{{item.name}}</span></Option>
            </Select>
          </FormItem>
          <FormItem label="模板文件">
            <div class="file-wrapper">
              <span class="file-name"
                    :title="formData.path">{{formData.path}}</span>
              <Button type="text"
                      size="small"
                      v-if="formData.path"
                      @click="deleteFilePath">删除</Button>
            </div>
          </FormItem>
          <Upload type="select"
                  :headers="{'Content-Type': 'multipart/form-data'}"
                  :before-upload="handleUpload"
                  :format="['jrxml']"
                  :disabled="importLoading"
                  :show-upload-list="false"
                  style="margin-left:30px;"
                  :action="$url + `/system-dict/dictTemplate/uploadFile`">
            <Button icon="ios-cloud-upload-outline"
                    style="margin-left: 10px;">上传文件</Button>
          </Upload>
          <div class="tip">仅支持拓展名：jrxml，非专业人员请勿随意上传</div>
        </Form>
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
import { uploadModule, moduleSave } from '@/api/moduleManage'
export default {
  props: {
    title: Number,
    visible: Boolean,
    moduleTypeDict: Array
  },
  data () {
    return {
      formData: {},
      isLoading: false,
      importLoading: false,
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增模板' : '修改模板')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    save () {
      if (this.isLoading) return false
      this.isLoading = true
      let params = Object.assign({}, this.formData)
      delete params._index
      delete params._rowKey

      moduleSave(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.$Message.success('保存成功！')
          this.$emit('updateList')
          this.$emit('close')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },
    init (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {}
      } else {
        console.log(row)
        this.formData = row
      }
    },
    handleUpload (file) {
      let reg = /\.jrxml/;
      if (!reg.test(file.name)) {
        this.$Message.warning(`仅支持上传.jrxml的文件格式`)
        return false
      }
      // 创建form对象
      let formData = new FormData()
      // 通过append向form对象添加数据
      formData.append("file", file)
      this.importLoading = true
      uploadModule(formData).then(({ data }) => {
        this.importLoading = false
        if (data.code == 0) {
          this.formData.path = data.data
          this.$Message.success('上传成功，保存后生效')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.importLoading = false
        this.$Message.error(err)
      })
      // 禁用自动上传
      return false
    },
    moduleTypeChange (obj) {
      if (obj) {
        this.formData.typeName = obj.label
      }
    },
    deleteFilePath () {
      this.formData.path = ''
    }
  }
}
</script>
<style lang="less">
.module-manage-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
  .file-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .file-name {
      display: inline-block;
      width: 140px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .ivu-btn-text {
      color: #ed4014;
    }
  }
  .tip {
    line-height: 50px;
    color: #ed4014;
    font-size: 12px;
    padding-left: 35px;
  }
}
</style>
