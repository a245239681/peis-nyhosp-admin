<template>
  <div>
    <Modal v-model="isVisible"
           class="archives-manage-modal"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           width="840">
      <div class="modal-body">
        <Form :model="formData"
              ref="form"
              :label-width="80"
              label-position="right"
              :rules="ruleValidate">
          <div class="top-wrapper">
            <div class="form">
              <Row :gutter="8">
                <Col span="12">
                <FormItem label="姓名"
                          prop="boName">
                  <Input v-model.trim="formData.boName"
                         size="small"
                         @on-blur="filterSpace"
                         clearable />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="体检号"
                          prop="boPeId">
                  <Input v-model="formData.boPeId"
                         size="small"
                         disabled />
                </FormItem>
                </Col>
              </Row>
              <Row :gutter="8">
                <Col span="12">
                <FormItem label="出生日期"
                          prop="boBirthday">
                  <DatePicker type="date"
                              placeholder="选择出生日期"
                              clearable
                              size="small"
                              v-model="formData.boBirthday"
                              @on-change="changeBirthday"
                              @on-clear="clearBirthday"
                              :options="birth"></DatePicker>
                </FormItem>
                </Col>
                <Col span="12">
                <Row :gutter="8">
                  <Col span="14">
                  <FormItem label="性别"
                            prop="boSex">
                    <Select v-model="formData.boSex"
                            size="small">
                      <!-- <Option value="不限">不限</Option> -->
                      <Option value="男">男</Option>
                      <Option value="女">女</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="10">
                  <FormItem label="年龄"
                            :label-width="40"
                            prop="boAge">
                    <Input v-model="formData.boAge"
                           size="small"
                           disabled />
                  </FormItem>
                  </Col>
                </Row>
                </Col>
              </Row>
              <Row :gutter="8">
                <Col span="12">
                <FormItem label="证件类型"
                          prop="boCertificatesType">
                  <Select v-model="formData.boCertificatesType"
                          size="small"
                          @on-change="changeCert">
                    <Option value="1">身份证</Option>
                    <Option value="2">士兵证</Option>
                    <Option value="3">军官证</Option>
                    <Option value="4">警官证</Option>
                    <Option value="5">护照</Option>
                    <Option value="6">其他</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="证件号码"
                          prop="boIdNo">
                  <Input v-model="formData.boIdNo"
                         size="small"
                         clearable
                         @on-blur="getAgeAndBirthday"
                         @on-enter="getAgeAndBirthday" />
                </FormItem>
                </Col>
              </Row>
              <Row :gutter="8">
                <Col span="12">
                <FormItem label="就诊卡号"
                          prop="boVisitCardNumber">
                  <Input v-model="formData.boVisitCardNumber"
                         size="small"
                         disabled />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="联系方式"
                          prop="boMobile">
                  <Input v-model="formData.boMobile"
                         size="small"
                         clearable />
                </FormItem>
                </Col>
              </Row>
            </div>
            <div class="photo">
              <img :src="formData.boPic"
                   v-if="formData.boPic"
                   alt="患者头像">
              <img src="@/assets/images/userPhoto.png"
                   v-else
                   alt="患者头像">
              <div class="btns"
                   style="margin-top: 10px;">
                <Button type="primary"
                        @click="openCaptureModal">拍照采集</Button>
                <Button type="error"
                        style="margin-left: 12px;"
                        @click="deletePic">删除照片</Button>
              </div>
            </div>
          </div>
          <div class="bottom-wrapper">
            <Row :gutter="8">
              <Col span="8">
              <FormItem label="婚姻状态"
                        prop="boMaritalStatus">
                <Select v-model="formData.boMaritalStatus"
                        size="small">
                  <!-- <Option value="未知">未知</Option> -->
                  <Option value="不详">不详</Option>
                  <Option value="未婚">未婚</Option>
                  <Option value="已婚">已婚</Option>
                  <!-- <Option value="离异">离异</Option>
                    <Option value="丧偶">丧偶</Option> -->
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="国籍"
                        prop="boCountryId">
                <Select v-model="formData.boCountryId"
                        :label-in-value="true"
                        @on-change="changeCountry"
                        size="small"
                        clearable
                        filterable>
                  <Option v-for="item in country"
                          :value="item.sdId"
                          :key="item.sdId">{{item.sdName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="民族"
                        prop="boNationId">
                <Select v-model="formData.boNationId"
                        :label-in-value="true"
                        @on-change="changeNation"
                        filterable
                        clearable
                        size="small">
                  <Option v-for="item in nation"
                          :value="item.sdId"
                          :key="item.sdId">{{item.sdName}}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="8">
              <FormItem label="身份"
                        prop="boIdentityId">
                <Select v-model="formData.boIdentityId"
                        :label-in-value="true"
                        @on-change="changeIdentity"
                        filterable
                        clearable
                        size="small">
                  <Option v-for="item in identity"
                          :value="item.sdId"
                          :key="item.sdId">{{item.sdName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="职业"
                        prop="boOccupationId">
                <Select v-model="formData.boOccupationId"
                        :label-in-value="true"
                        @on-change="changeOccupation"
                        filterable
                        clearable
                        size="small">
                  <Option v-for="item in occupation"
                          :value="item.sdId"
                          :key="item.sdId">{{item.sdName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="HIS号码"
                        prop="boPatientId">
                <Input v-model="formData.boPatientId"
                       size="small"
                       disabled />
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="24">
              <FormItem label="单位名称"
                        prop="boUnitName">
                <div v-click-outside.capture="onClickOutside"
                     v-click-outside:mousedown.capture="onClickOutside">
                  <div ref="unitInputBox"
                       @keydown.esc="handleKeydown"
                       @keydown.enter="handleKeydown"
                       @keydown.up.prevent="handleKeydown"
                       @keydown.down.prevent="handleKeydown"
                       @keydown.tab="handleKeydown"
                       @keydown.delete="handleKeydown">
                    <Input v-model="formData.boUnitName"
                           size="small"
                           @on-change="searchUnit"
                           @on-clear="clearUnit"
                           clearable />
                  </div>
                  <transition name="drop">
                    <ul class="serch-unit-result"
                        v-show="showSearchResult">
                      <li v-for="(item, index) in unitsList"
                          :class="{'select-focus':index == focusIndex}"
                          :key="index"
                          @click="selectUnitName(index)">{{ item.boUnitName }}</li>
                    </ul>
                  </transition>
                </div>
              </FormItem>
              </Col>
              <!-- <Col span="8">
              <FormItem label="体检分组"
                        prop="boGroupId">
                <Select v-model="formData.boGroupId"
                        :label-in-value="true"
                        @on-change="changeGroup"
                        size="small"
                        clearable>
                  <Option v-for="item in groupsList"
                          :value="item.boGroupId"
                          :key="item.boGroupId">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              </Col> -->
            </Row>
            <Row :gutter="8">
              <Col span="8">
              <FormItem label="省份"
                        prop="boAddrProvince">
                <Input v-model="formData.boAddrProvince"
                       size="small"
                       clearable />
                <!-- <Select v-model="formData.boAddrProvince" size="small">
                    <Option v-for="item in provinceList" :value="item.boGroupId" :key="item.boGroupId">{{ item.name }}
                    </Option>
                  </Select> -->
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="城市"
                        prop="boAddrCity">
                <Input v-model="formData.boAddrCity"
                       size="small"
                       clearable />
                <!-- <Select v-model="formData.boAddrCity" size="small">
                    <Option v-for="item in cityList" :value="item.boGroupId" :key="item.boGroupId">{{ item.name }}
                    </Option>
                  </Select> -->
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="县、区"
                        prop="boAddrCounty">
                <Input v-model="formData.boAddrCounty"
                       size="small"
                       clearable />
                <!-- <Select v-model="formData.boAddrCounty" size="small">
                    <Option v-for="item in countyList" :value="item.boGroupId" :key="item.boGroupId">{{ item.name }}
                    </Option>
                  </Select> -->
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="16">
              <FormItem label="详细地址"
                        prop="boAddress">
                <Input v-model="formData.boAddress"
                       size="small"
                       clearable />
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="邮政编码"
                        prop="boPostcode">
                <Input v-model.number="formData.boPostcode"
                       size="small"
                       clearable />
              </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">保存
        </Button>
      </div>
      <capture :visible="captureModalVisible"
               v-if="hackReset"
               @cancel="closeCaptureModal"
               @ok="importPic"></capture>
    </Modal>
  </div>
</template>
<script>
import { archivesSave, getField, deletePhoto } from '@/api/archives_manage.js'
import { countryList, nationList, occupationList, identityList } from '@/api/dict'
import { getBirthAndAge } from '@/libs/tools.js'
import Capture from '@/views/appointmentRegister/components/capture';
import { listAllByUnitId, listByName } from '@/api/personal_appointment.js';
import moment from 'moment'
import { directive as clickOutside } from 'v-click-outside-x';

export default {
  directives: { clickOutside },
  components: {
    Capture
  },
  props: {
    title: Number,
    visible: Boolean,
    picurl: String,
  },
  data () {
    const checkIdno = (rule, value, callback) => {
      // 身份证为空时，也可以通过校验
      let reg2 = true
      if (!value) {
        reg2 = false
      } else if (value.length == 15 || value.length == 18) {
        reg2 = true
      }
      if (reg2 && this.formData.boCertificatesType == 1) {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!reg.exec(value)) {
          callback(new Error('请输入正确的身份证号'))
        }
      } else if (reg2 && this.formData.boCertificatesType == 5) {
        const reg1 = /^[a-zA-Z0-9]{3,21}$/
        const reg2 = /^(P\d{7})|(G\d{8})$/
        if (!reg1.exec(value) && !reg2.exec(value)) {
          callback(new Error('请输入正确的护照号'))
        }
      } else if (reg2 && this.formData.boCertificatesType == 2 && this.formData.boCertificatesType == 3) {
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
    };
    const checkPhone = (rule, value, callback) => {
      if (!value || (value && value.trim() === '')) {
        callback()
      } else {
        const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/ //  带杠的电话号码
        const reg2 = /^1[3|4|5|6|7|8][0-9]{9}$/ // 手机号码
        const reg3 = /^[0-9]{11,12}$/ //  纯数字的电话号码
        if (!reg.test(value) && !reg2.test(value) && !reg3.test(value)) {
          callback(new Error('手机号或座机号有误'))
        }
        callback()
      }
    }
    return {
      ruleValidate: {
        boName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        boIdNo: [
          { validator: checkIdno, trigger: 'blur' }
        ],
        boSex: [
          { required: true, message: '请选择性别' }
        ],
        boMobile: [
          { validator: checkPhone, trigger: 'change' }
        ],
        boBirthday: [
          { required: true, message: '生日不能为空' }
        ]
      },
      birth: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000;
        }
      },
      formData: {},
      unitsList: [],
      groupsList: [],
      provinceList: [],
      cityList: [],
      countyList: [],
      isLoading: false,
      captureModalVisible: false,
      showSearchResult: false,
      hackReset: false,
      // grayInput: false,
      unitTimer: null,
      focusIndex: -1,
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增档案' : '编辑档案')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    country: {
      get: function () {
        return this.$store.getters.getCountryDict
      },
      set: function () {
      }
    },
    identity: {
      get: function () {
        return this.$store.getters.getIdentityDict
      },
      set: function () {
      }
    },
    nation: {
      get: function () {
        return this.$store.getters.getNationDict
      },
      set: function () {
      }
    },
    occupation: {
      get: function () {
        return this.$store.getters.getOccupationDict
      },
      set: function () {
      }
    }
  },
  mounted () {

    this.$store.dispatch('getCountryDict');
    this.$store.dispatch('getIdentityDict');
    this.$store.dispatch('getNationDict');
    this.$store.dispatch('getOccupationDict');
    // let j = getField();
    // let jj = {};
    // for(let i in j){
    //   jj[i]="";
    // }
    // this.formData = jj;
    // console.log(this.formData)
  },
  methods: {
    onClickOutside (event) {
      console.log(event)
      if (this.showSearchResult) {
        if (event.type === 'mousedown') {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        this.showSearchResult = false;
      } else {
      }
    },
    // 去除姓名字段空格
    filterSpace () {
      this.formData.boName = this.formData.boName.replace(/\s+/g, "")
    },
    handleKeydown (e) {
      console.log(e)
      if (e.key === 'Backspace') {
        return; // so we don't call preventDefault
      }

      if (this.showSearchResult) {
        e.preventDefault();
        if (e.key === 'Tab') {
          e.stopPropagation();
        }

        // Esc slide-up
        if (e.key === 'Escape') {
          e.stopPropagation();

        }
        // next
        if (e.key === 'ArrowUp') {
          this.navigateOptions(1);
        }
        // prev
        if (e.key === 'ArrowDown') {
          this.navigateOptions(-1);
        }
        // enter
        if (e.key === 'Enter') {
          // let selectedOption = this.unitsList[this.focusIndex].boUnitName
          // this.$set(this.formData, 'boUnitName', selectedOption)
          this.selectUnitName(this.focusIndex)
        }
      }
    },
    navigateOptions (direction) {
      if (!this.unitsList) return
      const optionsLength = this.unitsList.length - 1;
      let index = this.focusIndex + direction;
      if (index < 0) index = optionsLength;
      if (index > optionsLength) index = 0;
      this.focusIndex = index;
    },
    //修改国家，民族，身份，职业
    changeCountry (e) {
      if (e != undefined) {
        this.formData.boCountry = e.label.trim();
      } else {
        this.formData.boCountry = ''
        this.formData.boCountryId = ''
      }
    },
    changeNation (e) {
      if (e != undefined) {
        this.formData.boNation = e.label.trim();
      } else {
        this.formData.boNation = ''
        this.formData.boNationId = ''
      }
    },
    changeIdentity (e) {
      if (e != undefined) {
        this.formData.boIdentity = e.label.trim();
      } else {
        this.formData.boIdentity = ''
        this.formData.boIdentityId = ''
      }
    },
    changeOccupation (e) {
      if (e != undefined) {
        this.formData.boOccupation = e.label.trim();
      } else {
        this.formData.boOccupation = ''
        this.formData.boOccupationId = ''
      }
    },
    // changeGroup (e) {
    //   console.log('更改分组')
    //   console.log(e)
    //   if (e != undefined) {
    //     this.formData.boGroupName = e.label.trim();
    //   } else {
    //     this.formData.boGroupId = ''
    //     this.formData.boGroupName = ''
    //   }
    // },
    //修改体检类型
    // changeCategory (e) {
    //   if (e != undefined) {
    //     this.formData.boCategory = e.label;
    //   }
    // },
    //导入预约用户图片地址
    importPic (base64Url) {
      // console.log(base64Url);
      this.formData.boPic = base64Url;
    },
    // 删除图片
    deletePic () {
      //隐藏图片，并未做实际删除
      this.formData.boPic = null
      // console.log(this.formData)
      if (!this.formData.boPeId) {
        console.log(this.formData)
        return
      }
      //如果有检查号，进行实际删除
      deletePhoto({ boPeId: this.formData.boPeId }).then(({ data }) => {
        if (data.code === 0) {
          this.$Message.success('删除照片成功！');
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true;
          this.formData.boBirthday = moment(this.formData.boBirthday).format('YYYY-MM-DD')
          let params = Object.assign({}, this.formData)
          if (/\.(jpeg|png|jpg)/i.test(params.boPic)) {
            params.boPic = params.boPic.split('?')[0]
          }
          archivesSave(params).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$emit('close')
              this.$refs.form.resetFields()
              // this.grayInput = true
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.isLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          });
        }
      })
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          boPeId: '',
          boAge: '',
          boBirthday: '',
          boSex: '',
          boIdNo: '',
          boCertificatesType: '1',
          boPic: '',
          boCountryId: '1',
        }
        // this.grayInput = false
        console.log(this.formData)
      } else {
        //  修复编辑时，返身份证类型为null时，提示生日不能为空的问题
        if (!row.boCertificatesType) {
          row.boCertificatesType = '1'
        }
        this.formData = row
        console.log(this.formData)
        if (!!row.boPic) {
          let picUrl = this.$url + row.boPic + '?time=' + new Date().getTime()
          console.log(picUrl)
          this.$set(this.formData, 'boPic', picUrl)
        }

        if (this.formData.boCertificatesType == 1 && this.formData.boIdNo != null) {
          let idNo = getBirthAndAge(this.formData.boIdNo);
          this.$set(this.formData, 'boAge', idNo.age);
        }
        // if (this.formData.boUnitId && this.formData.boUnitId != '0') {
        //   this.getGroups()
        // }
      }
    },
    closeModal () {
      this.$emit('close')
      this.$refs.form.resetFields()
      console.log(this.formData)
      // this.grayInput = true
    },
    //改变证件类型时，若为身份证，灰掉出生年月、年龄的输入框
    changeCert () {
      if (this.formData.boCertificatesType == 1) {
        if (this.formData.boIdNo) {
          this.getAgeAndBirthday()
        }
        // this.grayInput = true
      } else {
        this.formData.boIdNo = ''
        this.formData.boBirthday = ''
        this.formData.boAge = ''
        // this.grayInput = false
      }
    },
    //其他证件，修改出生日期时，计算年龄
    changeBirthday (e) {
      if (!e) return;

      let birthday = e.split("-")
      //获取当前年月日并计算年龄
      let myDate = new Date();
      let monthNow = myDate.getMonth() + 1;
      let dayNow = myDate.getDate();
      let age = myDate.getFullYear() - birthday[0];
      if (monthNow < birthday[1] || (monthNow == birthday[1] && dayNow < birthday[2])) {
        age--
      }
      this.formData.boAge = age
    },
    clearBirthday () {
      this.formData.boAge = ''
    },
    //根据身份证号，计算年龄和出生日期
    getAgeAndBirthday () {
      if (this.formData.boIdNo && this.formData.boCertificatesType == 1) {
        let idNo = getBirthAndAge(this.formData.boIdNo);
        if (idNo.message) {
          this.$Message.error(idNo.message)
          this.$set(this.formData, 'boBirthday', '');
          this.$set(this.formData, 'boAge', '');
          this.$set(this.formData, 'boSex', '');
        } else {
          this.$set(this.formData, 'boBirthday', idNo.birthday);
          this.$set(this.formData, 'boAge', idNo.age);
          this.$set(this.formData, 'boSex', idNo.sex);
        }
      }
    },
    // 查询体检分组
    // getGroups () {
    //   let groupParam = {
    //     boUnitId: this.formData.boUnitId,
    //     boSex: this.formData.boSex
    //   }
    //   listAllByUnitId(groupParam).then(res => {
    //     console.log(res);
    //     let result = res.data;
    //     if (result.code === 0) {
    //       this.groupsList = result.data;
    //     } else {
    //       this.$Message.error(result.Message);
    //     }
    //   })
    // },
    //搜索单位名称
    searchUnit () {
      this.unitTimer && clearTimeout(this.unitTimer);
      if (!this.formData.boUnitName) {
        this.clearUnit();
        return false;
      }
      this.unitTimer = setTimeout(() => {
        let params = {
          boUnitName: this.formData.boUnitName
        };
        listByName(params).then(res => {
          let result = res.data;
          if (result.code === 0) {
            this.showSearchResult = true;
            this.unitsList = result.data;
          } else {
            this.$Message.error(result.message);
          }
        });
      }, 300)
    },
    //选中单位后
    selectUnitName (index) {
      this.formData.boUnitName = this.unitsList[index].boUnitName;
      this.formData.boUnitCode = this.unitsList[index].boUnitCode;
      this.formData.boUnitId = this.unitsList[index].boUnitId;
      // this.getGroups();
      this.showSearchResult = false;
      this.unitsList = [];
    },
    //清空单位后
    clearUnit () {
      this.showSearchResult = false;
      this.formData.boUnitCode = '';
      this.formData.boGroupId = '';
      this.unitsList = [];
      this.groupsList = [];
      this.focusIndex = -1
    },
    openCaptureModal () {
      this.captureModalVisible = true;
      this.$nextTick(() => {
        this.hackReset = true;//重建组件
      });
    },
    closeCaptureModal () {
      this.captureModalVisible = false;
      this.hackReset = false; //销毁组件
    }
  }
}
</script>
<style lang="less">
.archives-manage-modal {
  .drop-enter-active,
  .drop-leave-active {
    transition: height 2s;
  }
  .drop-enter, .drop-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
  }
  .ivu-input {
    color: #000;
  }
  .modal-body {
    width: 100%;
  }
  .top-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .form {
      width: 66%;
    }

    .photo {
      width: 29%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      img {
        width: 55%;
      }
    }
  }

  .bottom-wrapper {
    widows: 100%;
    .serch-unit-result {
      max-height: 200px;
      overflow-y: auto;
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      top: 30px;
      left: 0;
      z-index: 10;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      margin: 5px 0;
      overflow: auto;
      .select-focus {
        background-color: #f3f3f3;
      }
      li {
        // color: #c5c8ce;
        padding: 0 10px;
        &:hover {
          background-color: #f3f3f3;
        }
      }
    }
  }
}
</style>
