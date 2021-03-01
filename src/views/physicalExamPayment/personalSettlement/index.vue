
<template>
  <div class="personal-settlement-wrapper">
    <div class="left-side">
      <Card>
        <div style='display:flex'>
          <img style='width:130px;height:165px;'></img>
          <Form :model="formItem"
                style='width:550px;'
                inline>
            <FormItem prop='number'
                      :label-width="50"
                      label='编号'>
              <Input type="text"
                     style='width:118px'
                     v-model="formItem.number">
              </Input>
            </FormItem>
            <FormItem prop='physicalExaminationID'
                      :label-width="50"
                      label='体检号'>
              <Input type="text"
                     style='width:118px'
                     v-model="formItem.physicalExaminationID">
              </Input>
            </FormItem>
            <FormItem prop='phoneNumber'
                      :label-width="50"
                      label='电话'>
              <Input type="text"
                     style='width:118px'
                     v-model="formItem.phoneNumber">
              </Input>
            </FormItem>
            <FormItem prop='name'
                      :label-width="50"
                      label='姓名'>
              <Input type="text"
                     style='width:118px'
                     v-model="formItem.name">
              </Input>
            </FormItem>
            <FormItem prop='age'
                      :label-width="50"
                      label='年龄'>
              <Input type="text"
                     style='width:50px'
                     v-model="formItem.age">
              </Input>
            </FormItem>
            <FormItem prop='sex'
                      :label-width="50"
                      label='性别'>
              <Select style='width:50px'
                      placeholder=''
                      v-model="model3">
                <Option v-for="item in formItem.sex"
                        :value="item"
                        :key="item">{{item}}</Option>
              </Select>
            </FormItem>
            <FormItem prop='marriage'
                      :label-width="50"
                      label='婚姻'>
              <Select style='width:60px'
                      v-model="model1">
                <Option v-for="item in formItem.marriage"
                        :value="item"
                        :key="item">{{item}}</Option>
              </Select>
            </FormItem>
            <FormItem prop='idSelect'
                      :label-width="50"
                      label='证件'>
              <Select style='width:118px'
                      v-model="model2">
                <Option v-for="item in formItem.idSelect"
                        :value="item"
                        :key="item">{{item}}</Option>
              </Select>
            </FormItem>
            <FormItem prop='id'
                      :label-width="50"
                      label='证件号'>
              <Input type="text"
                     style='width:150px'
                     v-model="formItem.id">
              </Input>
            </FormItem>
          </Form>
        </div>
        <Form :model="formItem"
              inline>
          <FormItem prop='companyName'
                    :label-width="80"
                    label='单位名称'>
            <Input type="text"
                   style='width:180px'
                   v-model="formItem.companyName">
            </Input>
          </FormItem>
        </Form>
      </Card>
    </div>
    <div class="right-side">
      <Card>

      </Card>
    </div>
  </div>
</template>
<script>

export default {
  name: 'personalSettlement',

  data () {
    return {
      model1: '',
      model2: '',
      model3: '',
      formItem: {
        number: '', // 编号
        physicalExaminationID: '', // 体检号
        phoneNumber: '',
        name: '',
        age: '',
        sex: ['男', '女'],
        marriage: ['已婚', '未婚'],
        idSelect: ['身份证', '军人证'], // 证件下拉框
        id: '',
        companyName: ''// 单位名称
      }
    }
  }
}
</script>
<style lang="less">
.personal-settlement-wrapper {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .left-side {
    width: 740px;
    height: 989px;
    border-radius: 5px;
    .ivu-card-body {
    }
  }
  .right-side {
    width: 800px;
  }
}
</style>
