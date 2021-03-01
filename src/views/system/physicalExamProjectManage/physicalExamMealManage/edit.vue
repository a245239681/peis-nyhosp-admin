<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :closable="true"
           class="mealManage-popup-wrapper"
           width="1500">
      <p slot="header">
        <span class="title">{{title == 0? '添加体检套餐' : '修改体检套餐'}}</span>
      </p>
      <div class="form-wrapper">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              label-position="right"
              inline>
          <FormItem label="套餐编号"
                    prop="paPackageCode">
            <Input v-model="formData.paPackageCode"
                   :number='true'
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="套餐名称"
                    prop="paPackageName"
                    :rules="[{ required: true, message: '请输入套餐名称', trigger: 'blur' }]">
            <Input v-model="formData.paPackageName"
                   @on-change="searchCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="拼音码"
                    prop="paPyCode"
                    :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]"
                    :label-width="70">
            <Input v-model="formData.paPyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="序号"
                    :label-width="50">
            <Input v-model="formData.paSort"
                   size="small"></Input>
          </FormItem>
          <FormItem label="套餐类别"
                    prop="paCategoryId"
                    :rules="[{ required: true, message: '请输入套餐类别' }]">
            <Select v-model="formData.paCategoryId"
                    style='min-width:200px'
                    size="small">
              <Option v-for='(item,index) of typeDict'
                      :key='index'
                      :value="item.cdId">{{item.cdName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="五笔码"
                    prop="paWbCode"
                    :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
            <Input v-model="formData.paWbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="性别范围"
                    prop="paSex"
                    :rules="[{ required: true, message: '请输入性别', trigger: 'change' }]">
            <Select v-model="formData.paSex"
                    @on-change="clearSelectedComboList"
                    size="small">
              <Option value='不限'>不限</Option>
              <Option value='男'>男</Option>
              <Option value='女'>女</Option>
            </Select>
          </FormItem>
          <FormItem label="套餐价格"
                    prop='paPrice'>
            <Input v-model="formData.paPrice"
                   disabled
                   :number='true'
                   size="small"></Input>
          </FormItem>
          <FormItem label="是否开启小程序"
                    :label-width="110"
                    prop='paPrice'>
            <RadioGroup v-model="formData.paIsWechat">
              <Radio label="0">是</Radio>
              <Radio label="1">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label=""
                    class="pic-btn"
                    :label-width="10"
                    prop='paPrice'>
            <Button size="small"
                    @click="uploadShowHandle"
                    type="default">上传图片</Button>
            <Button type="text"
                    :disabled="!formData.paPackagePic"
                    @click="showPicHandle"
                    :class="{active : formData.paPackagePic}">查看图片
              <Icon type="md-arrow-dropright-circle" /></Button>
          </FormItem>
          <!-- <FormItem label="折扣率"
                    prop='paDiscount'>
            <Input v-model="formData.paDiscount"
                   disabled
                   :number='true'
                   size="small"></Input>
          </FormItem> -->
        </Form>
      </div>
      <div class="modal-body">
        <div class="selected-item-wrapper">
          <h3 class="selected-title">包含组合项目组</h3>
          <ul>
            <li>
              <tree-table ref="treeTable"
                          :columns="columnsKs"
                          :data="treeData"
                          :expand-type="false"
                          :is-fold="false"
                          :selectable="false"
                          :empty-text="emptyText">
                <template slot="paDeptName"
                          slot-scope="{row}">
                  <span>{{row.paDeptName}}</span>
                </template>
                <!-- <template slot="paDiscountValue"
                          slot-scope="{row}">
                  <span>{{row.paDiscountValue}}</span>
                </template> -->
                <template slot="paComboCode"
                          slot-scope="{row}">
                  <span>{{row.paComboCode}}</span>
                </template>
                <template slot="paStatus"
                          slot-scope="{row}">
                  <Tag color="green"
                       v-if="row.paStatus == 1">有效</Tag>
                  <Tag color="orange"
                       v-else-if="row.paStatus == 0">无效</Tag>
                  <!-- <span>{{row.paStatus==1?'有效':row.paStatus==0?'有效':''}}</span> -->
                </template>
                <template slot="paComboName"
                          slot-scope="{row}">
                  <span>{{row.paComboName}}</span>
                </template>
                <template slot="paPrice"
                          slot-scope="{row}">
                  <span>{{row.paPrice}}</span>
                </template>
                <template slot="action"
                          slot-scope="{row}">
                  <Button type="error"
                          size="small"
                          @click="removeCombo(row)"
                          ghost>移除</Button>
                </template>
              </tree-table>

            </li>
          </ul>
        </div>
        <div class="unselected-item-wrapper">
          <div class="title-wrapper">
            <p class="title">
              <span>未选项目组合</span>
            </p>
            <div class="title-right-tool">
              <Input search
                     enter-button
                     style="width: 200px"
                     v-model="itemName"
                     size="small"
                     @on-search="getList()"
                     placeholder="搜索体检项目" />
            </div>
          </div>
          <div class="main-wrapper">
            <div class="room-selected-wrapper">
              <Input search
                     enter-button
                     size="small"
                     v-model="keyword"
                     placeholder="搜索科室" />
              <ul class="room-list-wrapper">
                <li v-if="keyword == ''"
                    :class="{'is-actived': curActive === 'all'}"
                    @click="getList('','all')">全部</li>
                <li :class="{'is-actived': curActive === index}"
                    v-for="(item, index) in roomFilter"
                    @click="getList(item,index)"
                    :key="index">{{item.poDeptName}}</li>
              </ul>
            </div>
            <div class="combit-item-wrapper">
              <Table :columns="columns"
                     :loading="isLoading"
                     @on-row-click="selectChange"
                     height="540"
                     :data="comboTableData">
                <template slot="paStatus"
                          slot-scope="{row}">
                  <Tag color="green"
                       v-if="row.paStatus == 1">有效</Tag>
                  <Tag color="orange"
                       v-else>无效</Tag>
                </template>
                <template slot="action"
                          slot-scope="{row}">
                  <Button type="default"
                          @click="addCombo(row)"
                          :disabled="caculateCombo(row.paId) == '已添加'"
                          size="small">{{caculateCombo(row.paId)}}</Button>
                </template></Table>
            </div>
          </div>
        </div>

      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                @click="save">保存</Button>
      </div>
    </Modal>
    <!-- 上传图片弹窗 -->
    <Modal v-model="uploadBtn"
           scrollable
           width="800"
           title="上传文件">
      <Upload type="drag"
              :headers="{'Content-Type': 'multipart/form-data'}"
              :before-upload="handleUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              accept="image/png, image/jpeg, application/jpg"
              :disabled="importLoading"
              :show-upload-list="true"
              :action="$url + `/booking/patientVisitPic/uploadPackageImg`">
        <div style="padding: 100px 0;">
          <Icon type="ios-cloud-upload"
                size="52"
                style="color: #3399ff"></Icon>
          <p>点击或拖拽文件到上传区域上传文件</p>
          <Spin fix
                v-if="importLoading"></Spin>
        </div>
      </Upload>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看图片弹窗 -->
    <Modal v-model="showPackagePic"
           scrollable
           width="800"
           class="package-pic-modal"
           title="查看图片">
      <div class="body-wrapper">
        <img v-if="formData.paPackagePic"
             :src="$url + formData.paPackagePic"
             alt="套餐图片">
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
// 加法
import { comboList } from '@/api/dict_examTestTube.js'
import { save, getList, mealTypeDict, uploadPackagePic } from '@/api/physicalExamMealManage.js'
import { truncate } from 'fs'
import { constants } from 'crypto'
import { debuglog } from 'util'
import { mapActions, mapGetters } from 'vuex'
import { getCode } from '@/api/common.js'
function accAdd (arg1, arg2) {
  var r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return Number(((arg1 * m + arg2 * m) / m).toFixed(2))
}
// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
  return accAdd(arg, this)
}
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      treeData: [],
      formData: {
        paPrice: 0
      },
      columnsKs: [
        {
          title: '科室',
          key: 'paDeptName',
          type: 'template',
          template: 'paDeptName',
          headerAlign: 'center',
          align: 'left'
        },
        // {
        //   title: '折后价',
        //   key: 'paDiscountValue',
        //   type: 'template',
        //   template: 'paDiscountValue',
        //   headerAlign: 'center',
        //   align: 'center'
        // },
        {
          title: '编号',
          key: 'paComboCode',
          type: 'template',
          template: 'paComboCode',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '状态',
          key: 'paStatus',
          type: 'template',
          template: 'paStatus',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'paComboName',
          type: 'template',
          template: 'paComboName',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '价格',
          key: 'paPrice',
          type: 'template',
          template: 'paPrice',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 80,
          align: 'center',
          type: 'template',
          template: 'action',
          headerAlign: 'center',
          align: 'center'
        }
      ],
      columns: [
        {
          title: '编号',
          key: 'paComboCode',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'paComboName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '性别',
          key: 'paSex',
          align: 'center',
          minWidth: 80
        },
        {
          title: '总价',
          key: 'paPrice',
          align: 'center',
          minWidth: 80
        },
        {
          title: '折后价',
          key: 'paDiscountValue',
          align: 'center',
          minWidth: 80
        },
        {
          title: '折扣',
          key: 'paDiscount',
          align: 'center',
          minWidth: 80
        },
        {
          title: '状态',
          slot: 'paStatus',
          align: 'center',
          minWidth: 80
        },
        {
          title: '操作',
          slot: 'action',
          width: 80,
          fixed: 'right',
          align: 'center'
        }
      ],
      comboTableData: [], // 组合列表
      curActive: 'all',
      keyword: '',
      selectedComboData: [], // 已选组合
      isLoading: false,
      emptyText: '暂无数据',
      value: '',
      typeDict: '',
      price: [],
      itemName: '',
      deptName: '', // 选中科室的名称
      uploadBtn: false, // 上传文件弹窗
      importLoading: false,
      showPackagePic: false
    }
  },
  computed: {
    ...mapGetters(['getRoomDict']),
    showTitle () {
      return this.title == 0 ? '新增体检套餐' : '编辑体检套餐'
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
    roomDict: {
      get: function () {
        return this.getRoomDict
      },
      set: function () { }
    },
    roomFilter () {
      this.curActive = ''
      if (this.keyword == '') {
        return this.getRoomDict
      }
      let arr = this.roomDict
      let newArr = []
      arr.forEach(item => {
        if (item.poDeptName.indexOf(this.keyword) >= 0) {
          newArr.push(item)
        }
      })
      return newArr
    },
    caculateCombo () {
      return function (val) {
        let selectedArr
        let tip = '添加'
        if (this.treeData.length > 0) {
          for (let i = 0; i < this.treeData.length; i++) {
            if (this.treeData[i].children.length > 0) {
              for (let j = 0; j < this.treeData[i].children.length; j++) {
                if (this.treeData[i].children[j].paId == val) {
                  tip = '已添加'
                }
              }
            }
          }
        }
        return tip
      }
    }
  },

  mounted () {
    this.$store.dispatch('getRoomDict')
    mealTypeDict({}).then(({ data }) => {
      if (data.code == 0) {
        this.typeDict = data.data
      }
    })
  },
  methods: {
    selectChange (row, index) { },
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.treeData = []
      this.price = []
      this.comboTableData = []
      this.curActive = ''
      this.$emit('close')
    },
    // choose (node, item) {//展开已选项目
    //   // let itemName = item.paComboTypeName
    //   node.title =
    //     // console.log(item)
    // },
    getList (item, index) {
      console.log(item)
      console.log(this.itemName)

      // 项目组合
      if (item) {
        if (item.poDeptName) {
          this.deptName = item.poDeptName
          this.itemName = ''
        } else {
          this.deptName = item
        }
      } else {
        if (index) {
          this.deptName = ''
          this.itemName = ''
        } else {
          this.deptName = ''
        }
      }
      this.curActive = index
      let params = {
        text: this.deptName,
        comboName: this.itemName
      }
      console.log(params)
      this.isLoading = true
      getList(params)
        .then(({ data }) => {
          this.isLoading = false
          if (data.code == 0) {
            // console.log(data)
            this.comboTableData = data.data
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    save () {
      if (this.treeData.length == 0) {
        this.$Message.error('套餐包含的项目组合不能为空')
        return false
      }
      this.$refs.form.validate(valid => {
        let packageComboList = []
        if (valid) {
          this.isLoading = true
          // console.log(this.treeData[0].children)
          for (let i = 0; i < this.treeData.length; i++) {
            for (let j = 0; j < this.treeData[i].children.length; j++) {
              packageComboList.push({
                paComboId: this.treeData[i].children[j].paId
              })
              // console.log(this.treeData[i].children[j].paId)
            }
          }
          let params = Object.assign(this.formData, {
            packageComboList: packageComboList
          })
          // console.log(params)
          save(params)
            .then(({ data }) => {
              this.isLoading = false
              // console.log(this.formData)
              if (data.code == 0) {
                this.$Message.success('保存成功！')
                this.$emit('updateList')
                this.closeModal()
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.isLoading = false
              this.$Message.error('网络不稳定，请稍后重试')
              this.closeModal()
            })
        }
      })
    },
    // 已选组合数据
    addCombo (row) {
      let number = 0
      // 性别判断
      if (!this.formData.paSex || this.formData.paSex == '') {
        this.$Message.error('请先选择套餐性别！')
        return false
      }
      if (row.paSex != this.formData.paSex && row.paSex != '不限' && this.formData.paSex != '不限') {
        this.$Message.error('组合与套餐性别不匹配，无法添加！')
        return false
      }
      if (row.paDiscountValue) {
        number = accAdd(this.formData.paPrice || 0, row.paDiscountValue)
        console.log(this.formData.paPrice)
        this.$set(this.formData, 'paPrice', number)
      }
      // console.log(JSON.parse(JSON.stringify(this.price)))
      // let newRow = Object.assign({ children: [row] }, row)
      if (this.treeData.length > 0) {
        let status
        this.treeData.forEach(item => {
          if (item.paDeptName == row.paDeptName) {
            item.children.push(row)
            return (status = true)
          }
        })
        if (status) {
        } else {
          this.treeData.push({ paDeptName: row.paDeptName, children: [row] })
        }
      } else {
        this.treeData.push({ paDeptName: row.paDeptName, children: [row] })
      }
    },
    // 移除选中组合数据
    removeCombo (row) {
      if (row.paDiscountValue) {
        let price = Number(
          (
            (this.formData.paPrice * 100 - row.paDiscountValue * 100) /
            100
          ).toFixed(2)
        )
        console.log(price)
        this.$set(this.formData, 'paPrice', price)
      } else {
        if (row.children) {
          let arr = []
          let delPrice = 0
          for (let i = 0; i < row.children.length; i++) {
            if (row.children[i].paDiscountValue) {
              delPrice += row.children[i].paDiscountValue
            }
          }
          let price = Number(
            ((this.formData.paPrice * 100 - delPrice * 100) / 100).toFixed(2)
          )
          console.log(price)
          console.log(delPrice)
          console.log(row.children)
          this.$set(this.formData, 'paPrice', price)
        }
      }
      if (row.children) {
        for (let i = 0; i < this.treeData.length; i++) {
          if (this.treeData[i].paDeptName == row.paDeptName) {
            this.treeData.splice(i, 1)
          }
        }
      } else {
        for (let i = 0; i < this.treeData.length; i++) {
          if (this.treeData[i].children) {
            for (let j = 0; j < this.treeData[i].children.length; j++) {
              if (this.treeData[i].children[j].paId == row.paId) {
                // this.treeData[i].children.splice(j, 1)
                if (
                  this.treeData[i].children.length == 1 &&
                  this.treeData[i].children
                ) {
                  this.treeData.splice(i, 1)
                  break
                } else {
                  this.treeData[i].children.splice(j, 1)
                }
              }
            }
          } else {
            // this.treeData.splice(i, 1)
            // break
          }
        }
      }
    },
    // 获取科室组合数据
    getComboList (item, index) {
      this.curActive = index
      let params
      if (Object.keys(item).length == 0) {
        params = {
          deptId: ''
        }
      } else {
        params = {
          deptId: item.poId
        }
      }
      this.isLoading = true
      comboList(params)
        .then(({ data }) => {
          this.isLoading = false
          if (data.code == 0) {
            this.comboTableData = data.data
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.paPackageName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'paPyCode', result.py)
          this.$set(this.formData, 'paWbCode', result.wb)
        }
      })
    },
    // 切换性别时，清空所选组合
    clearSelectedComboList () {
      this.$set(this.formData, 'paPrice', 0)
      this.treeData = []
    },
    // 上传图片弹窗
    uploadShowHandle () {
      this.uploadBtn = true
    },
    // 查看图片弹窗
    showPicHandle () {
      this.showPackagePic = true
    },
    handleUpload (file) {
      let reg = /\.(jpg|jpeg|bmp|png)$/
      if (!reg.test(file.name)) {
        this.$Message.error(`不支持上传文件：${file.name} 的文件格式`)
        return false
      }
      // 创建form对象
      let formData = new FormData()
      // 通过append向form对象添加数据
      formData.append('file', file)
      formData.append('packageName', this.formData.paPackageName)
      this.importLoading = true
      uploadPackagePic(formData).then(({ data }) => {
        this.importLoading = false
        if (data.code == 0) {
          this.$set(this.formData, 'paPackagePic', data.data)
          this.uploadBtn = false
          this.$Message.success('上传成功，需要保存才能完成套餐图片修改')
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
    // 上传非标报告成功回调
    uploadSuccess (res, file) {
      console.log(res)
    },
    uploadError (err, file) {
      console.log(err)
    },
    getItemList (row) {
      console.log(row)
      if (Object.keys(row).length == 0) {
        this.formData = {
          sdStatus: '0',
          paIsWechat: '1'
        }
      } else {
        this.formData = row
        console.log(row)
        row.comboList.forEach(res => {
          this.price.push(res.paDiscountValue)
        })
        console.log(this.price)
        let arr = []
        for (let i = 0; i < row.comboList.length; i++) {
          // console.log(row.comboList[i].paDeptName)
          if (arr.indexOf(row.comboList[i].paDeptName) < 0) {
            arr.push(row.comboList[i].paDeptName)
            // console.log(arr[i])
          }
        }
        let obj = []
        for (let i = 0; i < arr.length; i++) {
          obj.push({ paDeptName: arr[i] })
        }
        // console.log(obj)
        let children = []
        for (let i = 0; i < obj.length; i++) {
          for (let j = 0; j < row.comboList.length; j++) {
            if (obj[i].paDeptName == row.comboList[j].paDeptName) {
              children.push(row.comboList[j])
            }
          }
          obj[i].children = children
          children = []
        }
        this.treeData = obj
        // console.log(this.treeData)
      }
    }
  }
}
</script>
<style lang="less">
.mealManage-popup-wrapper {
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
  .pic-btn {
    .ivu-btn-default {
      color: #2d8cf0;
      border-color: #2d8cf0;
    }
    .ivu-btn-text.active {
      color: #2d8cf0;
    }
  }
  .modal-body {
    width: 100%;
    margin: 0 auto;
    display: flex;
    .form-wrapper {
      width: 280px;
      border-right: 1px solid #e5e5e5;
      padding-right: 10px;
    }

    .selected-item-wrapper {
      width: 600px;
      margin-left: 10px;
      border-radius: 4px;
      .selected-title {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        background-color: #d6eaff;
        padding-left: 10px;
      }
      .zk-table__header-cell {
        .zk-table__cell-inner {
          padding: 0;
        }
      }
      .zk-table__cell-inner {
        padding: 0 0 0 10px;
        .zk-table--level-2-cell {
          padding: 0 !important;
        }
      }
      ul::-webkit-scrollbar {
        width: 5px;
        background-color: #eee;
      }
      ul::-webkit-scrollbar-button {
        display: none;
      }
      ul::-webkit-scrollbar-corner {
        display: none;
      }
      ul::-webkit-scrollbar-thumb {
        border-radius: 5px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #e8e8e8;
      }
      ul {
        max-height: 500px;
        overflow-y: auto;
      }
      li {
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        line-height: 48px;
        min-height: 48px;
        // padding: 0 10px;
      }
    }
    .unselected-item-wrapper {
      margin-left: 10px;
      border-left: 1px solid #e5e5e5;
      padding-left: 10px;
      flex: 1;
      overflow: auto;
      .title-wrapper {
        padding: 12px 0;
        display: flex;
        justify-content: space-between;
      }
      .main-wrapper {
        display: -webkit-box;
        width: 100%;
      }
      .room-selected-wrapper {
        width: 200px;
        .room-list-wrapper {
          margin-top: 15px;
          max-height: 500px;
          overflow-y: auto;
          li {
            padding-left: 10px;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #252525;
            &:hover {
              color: #57a3f3;
              cursor: pointer;
            }
          }
          li.is-actived {
            color: #2d8cf0;
            background-color: #f0faff;
          }
        }
        ul::-webkit-scrollbar {
          width: 5px;
          background-color: #eee;
        }
        ul::-webkit-scrollbar-button {
          display: none;
        }
        ul::-webkit-scrollbar-corner {
          display: none;
        }
        ul::-webkit-scrollbar-thumb {
          border-radius: 5px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #e8e8e8;
        }
      }
      .combit-item-wrapper {
        flex: 1;
        margin-left: 10px;
        .ivu-btn-default {
          color: #2d8cf0;
          border-color: #2d8cf0;
        }
        .ivu-btn[disabled] {
          color: #c5c8ce;
          background-color: #f7f7f7;
          border-color: #dcdee2;
        }
      }
    }
  }
}
.package-pic-modal {
  .body-wrapper {
    display: flex;
    justify-content: center;
    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
