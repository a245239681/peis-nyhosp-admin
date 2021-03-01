<template>
  <div>
    <Modal class="eidt-popup modal"
           v-model="isVisible"
           width="550"
           :title="showTitle"
           :mask-closable="false"
           @on-cancel="closeEditModal">
      <Form :model="formData"
            :rules="ruleValidate"
            :label-width="80"
            ref="form">
        <FormItem label="单位信息">
          <!-- <Input v-model="formData.unitName" disabled placeholder=""></Input> -->
          <div class="unit-name">
            {{boUnitName}}
          </div>
        </FormItem>
        <FormItem label="部门">
          <Cascader :data="deptData"
                    v-model="selectValue"
                    change-on-select
                    @on-change="handleChange"></Cascader>
        </FormItem>
        <Row>
          <Col span="9">
          <FormItem label="姓名"
                    prop="boName"
                    style="width:200px;">
            <Input v-model="formData.boName"
                   @on-blur="filterSpace"
                   placeholder=""></Input>
          </FormItem>
          </Col>
          <Col span="1">
          &nbsp;
          </Col>
          <Col span="14">
          <FormItem label="身份证号"
                    prop="boIdNo"
                    :label-width="70">
            <Input v-model="formData.boIdNo"
                   clearable
                   search
                   @on-search="getAgeAndBirthday"
                   @on-blur="AgeAndBirthday"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="9">
          <FormItem label="出生日期"
                    prop="boBirthday"
                    style="width:200px;">
            <DatePicker type="date"
                        placeholder="请选择日期"
                        style="width: 200px"
                        clearable
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        v-model="formData.boBirthday"
                        :options="birth"
                        @on-change="changeBirthday"
                        @on-clear="clearBirthday"></DatePicker>
          </FormItem>
          </Col>
          <Col span="7"
               style="text-align: center">
          <FormItem label="性别"
                    prop="boSex"
                    style="width:180px;">
            <Select v-model="formData.boSex"
                    clearable>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="1">
          &nbsp;
          </Col>
          <Col span="7">
          <FormItem label="年龄"
                    :label-width="60">
            <Input v-model="formData.boAge"
                   placeholder=""></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="9">
          <FormItem label="婚姻状况"
                    style="width:200px;">
            <Select v-model="formData.boMaritalStatus">
              <Option value="不详">不详</Option>
              <Option value="未婚">未婚</Option>
              <Option value="已婚">已婚</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="15">
          <FormItem label="手机号码"
                    prop="boMobile">
            <Input v-model="formData.boMobile"
                   placeholder=""></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="9">
          <FormItem label="身份"
                    prop="boIdentityId"
                    style="width:200px;">
            <Select v-model="formData.boIdentityId">
              <Option v-for="item in identityList"
                      :value="item.sdId"
                      :key="item.sdId">{{item.sdName}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="15">
          <FormItem label="职业"
                    prop="boOccupation">
            <Select v-model="formData.boOccupationId">
              <Option v-for="item in occupationList"
                      :value="item.sdId"
                      :key="item.sdId">{{item.sdName}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="9">
          <FormItem label="邮政编码"
                    style="width:200px;">
            <Input v-model="formData.boPostcode"
                   placeholder=""></Input>
          </FormItem>
          </Col>
          <Col span="15">
          <FormItem label="家庭住址">
            <Input v-model="formData.boAddress"
                   placeholder=""></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="closeEditModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="handleAdd">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  unitPersonAdd,
  getDeptInfoByUnit,
  getMasterIndexByNameAndIdNo
} from "@/api/unitManage_unitPersonManage.js";
import { getBirthAndAge } from "@/libs/tools.js";
import moment from "moment";

export default {
  name: "edit",
  props: {
    title: Number,
    visible: Boolean,
    boUnitName: String,
    boUnitId: String,
    boGroupId: String,
    visitSn: [Number, String]
  },
  data () {
    const checkIdno = (rule, value, callback) => {
      if (this.formData.boCertificatesType == 1) {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.exec(value)) {
          callback(new Error("请输入正确的身份证号"));
        }
        callback();
      } else if (this.formData.boCertificatesType == 5) {
        const reg1 = /^[a-zA-Z0-9]{3,21}$/;
        const reg2 = /^(P\d{7})|(G\d{8})$/;
        if (!reg1.exec(value) && !reg2.exec(value)) {
          callback(new Error("请输入正确的护照号"));
        }
        callback();
      } else if (
        this.formData.boCertificatesType == 2 &&
        this.formData.boCertificatesType == 3
      ) {
        const reg = /^[a-zA-Z0-9]{7,21}$/;
        if (!reg.exec(value)) {
          callback(new Error("请输入正确的证件号"));
        }
        callback();
      } else {
        callback();
      }
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
        // boName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        // boIdNo: [
        //   { required: true, message: "证件号不能为空", trigger: "blur" },
        //   { validator: checkIdno, trigger: "change" }
        // ],
        boBirthday: [{ required: true, message: "出生日期不能为空" }],
        boSex: [{ required: true, message: "请选择性别", trigger: "change" }],
        // // boAge: [
        // //   {required: true, message: '请输入年龄', trigger: 'blur'},
        // // ],
        boMobile: [
          // { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'change' }
        ],
      },
      birth: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000;
        }
      },
      formData: {
        boName: "",
        boIdNo: "",
        boBirthday: "",
        boSex: "",
        boAge: "",
        boMobile: "",
        boMaritalStatus: "",
        boIdentityId: "",
        boOccupationId: "",
        boPostcode: "",
        boAddress: ""
      },
      selectLoading: false,
      options: [],
      isLoading: false,
      deptData: [], // 单位部门数据
      selectValue: [] // 选择的部门数据
    };
  },
  computed: {
    showTitle () {
      return this.title == 0 ? "添加人员基本信息" : "编辑人员基本信息";
    },
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () { }
    },
    identityList: {
      get: function () {
        return this.$store.getters.getIdentityDict;
      },
      set: function () { }
    },
    occupationList: {
      get: function () {
        return this.$store.getters.getOccupationDict;
      },
      set: function () { }
    }
  },
  mounted () {
    this.$store.dispatch("getOccupationDict");
    this.$store.dispatch("getIdentityDict");
  },
  methods: {
    closeEditModal () {
      this.formData = {};
      this.deptData = [];
      this.selectValue = [];
      this.$refs.form.resetFields();
      this.$emit("close");
    },
    handleAdd () {
      this.$refs.form.validate(valid => {
        if (valid) {

          this.formData.boUnitName = this.boUnitName;
          this.formData.boUnitId = this.boUnitId;
          this.formData.boGroupId = this.boGroupId;
          this.formData.boUnitVisitSn = this.visitSn;
          this.formData.boBirthday = moment(this.formData.boBirthday).format(
            "YYYY-MM-DD"
          );
          this.formData.boAge = this.formData.boAge.toString();
          this.isLoading = true;
          unitPersonAdd(this.formData)
            .then(({ data }) => {
              console.log(data);
              this.isLoading = false;
              if (data.code == 0) {
                this.$Message.success("保存成功！");
                this.$emit("updateList");
                this.closeEditModal();
              } else {
                // this.$emit('close')
                // this.formData = {}
                this.$Message.error(data.message);
              }
            })
            .catch(err => {
              console.log(err)
              this.isLoading = false;
              this.$Message.error("网络不稳定，请稍后重试");
            });
        }
      });
    },

    // 去除姓名字段空格
    filterSpace () {
      this.formData.boName = this.formData.boName.replace(/\s+/g, "")
    },

    // 选择部门
    handleChange (value, selectedData) {
      if (selectedData.length == 2) {
        // 即选择了父级部门，又选择了子级部门
        this.formData.boSubDepartmentName = selectedData[1].deptName
        this.formData.boSubDepartmentId = selectedData[1].deptId
        this.formData.boDepartmentId = selectedData[1].parentId
        this.formData.boDepartment = selectedData[1].parentName
        // console.log(this.formData)
      } else if (selectedData.length == 1) {
        // 只选择了父级
        this.formData.boSubDepartmentName = ''
        this.formData.boSubDepartmentId = ''
        this.formData.boDepartmentId = selectedData[0].deptId
        this.formData.boDepartment = selectedData[0].name
      } else {
        // 什么都没有选
        this.formData.boSubDepartmentName = ''
        this.formData.boSubDepartmentId = ''
        this.formData.boDepartmentId = ''
        this.formData.boDepartment = ''

      }
    },

    // 获取单位部门
    getDeptList () {
      const params = {
        boUnitId: this.boUnitId,
        boUnitVisitSn: this.visitSn
      }
      getDeptInfoByUnit(params).then(({ data }) => {
        if (data.code == 0) {
          this.deptData = data.data
          this.transCascaderData(this.deptData)
          console.log(this.deptData)
        } else {
          this.$Message.error(data.message)
        }
      })
    },

    // 处理级联数据
    transCascaderData (arr) {
      arr.forEach(item => {
        item.value = item.deptId
        item.label = item.name
        if (item.children) {
          item.children.forEach(v => {
            v.value = v.deptId
            v.label = v.deptName
          })
        }
      })
      return arr
    },

    remoteMethod (query) {
      if (query !== "") {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          REsdx;
          const list = this.list.map(item => {
            return {
              value: item,
              label: item
            };
          });
          this.options1 = list.filter(
            item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          );
        }, 200);
      } else {
        this.options1 = [];
      }
    },
    //输入框失焦时,根据身份证号，计算年龄和出生日期
    AgeAndBirthday () {
      console.log("失去焦点");
      if (this.formData.boIdNo) {
        let no = this.formData.boIdNo.trim();
        let idNo = getBirthAndAge(no);
        if (idNo.message) {
          this.$Message.error(idNo.message);
          this.$set(this.formData, "boBirthday", "");
          this.$set(this.formData, "boAge", "");
          this.$set(this.formData, "boSex", "不限");
        } else {
          console.log(idNo.birthday);
          this.$set(this.formData, "boBirthday", idNo.birthday);
          this.$set(this.formData, "boAge", idNo.age);
          this.$set(this.formData, "boSex", idNo.sex);
        }
      }
      console.log(this.formData);
    },

    //根据身份证号，获取档案信息；无档案，则计算年龄及出生日期
    getAgeAndBirthday () {
      // let name = this.patientInfoForm.boName.trim();

      if (!this.formData.boIdNo) return;
      let params = {
        boIdNo: this.formData.boIdNo.trim(),
        boCertificatesType: "1"
      };
      getMasterIndexByNameAndIdNo(params)
        .then(({ data }) => {
          // console.log(data)
          if (data.data) {
            let res = data.data.records[0];
            console.log(res);
            Object.assign(this.formData, res);
            console.log(this.formData);
            // this.$set(this.formData, res)
            // this.formData.boName = res.boName
            // this.formData.boIdNo = res.boIdNo
            // this.formData.boBirthday = res.boBirthday
            // this.formData.boSex = res.boSex
            // this.formData.boAge = res.boAge
            // this.formData.boMaritalStatus = res.boMaritalStatus
            // this.formData.boMobile = res.boMobile
            // this.formData.boIdentity = res.boIdentity
            // this.formData.boOccupationId = res.boOccupationId
            // this.formData.boPostcode = res.boPostcode
            // this.formData.boAddress = res.boAddress
          } else {
            // this.$Message.info('');
          }
        })
        .catch(err => {
          // this.$Message.error("网络不稳定，请稍后重试");
        });
    },

    changeBirthday (e) {
      if (!e) return;

      let birthday = e.split("-");
      //获取当前年月日并计算年龄
      let myDate = new Date();
      let monthNow = myDate.getMonth() + 1;
      let dayNow = myDate.getDate();
      let age = myDate.getFullYear() - birthday[0];
      if (
        monthNow < birthday[1] ||
        (monthNow == birthday[1] && dayNow < birthday[2])
      ) {
        age--;
      }
      this.$set(this.formData, 'boAge', age)
    },

    clearBirthday () {
      this.formData.boAge = "";
    }
  }
};
</script>

<style lang="less">
.eidt-popup {
  .ivu-date-picker-rel {
    width: 114px;
  }
  .unit-name {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 8px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: not-allowed;
    font-size: 14px;
    background-color: #f3f3f3;
  }
}
</style>

