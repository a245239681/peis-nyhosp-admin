<template>
  <div class="add-combo-meal-wrapper">
    <div class="left-side">
      <Card style="width:600px">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">已选体检项目</span>
          <Button type="default"
                  size="small">排序</Button>
        </div>
        <tree-table ref="treeTable"
                    :columns="columns"
                    :data="tableData"
                    :expand-type="false"
                    :selectable="false"
                    border
                    expand-key="name">
        </tree-table>
      </Card>
    </div>
    <div class="middle-side">
      <Card style="width:500px">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">未选项目组合</span>
          <Input search
                 enter-button
                 size="small"
                 style="width: 200px"
                 placeholder="搜索" />
        </div>
        <div class="tree-wrapper">
          <v-tree ref="tree"
                  :data="treeData"
                  :radio="true"></v-tree>
        </div>
        <div class="items-wrapper">
          <div class="physical-item">
            <span class="name">身高、体重</span>
            <Button type="default"
                    size="small">添加</Button>
          </div>
          <div class="physical-item">
            <span class="name">身高、体重</span>
            <Button type="default"
                    size="small">添加</Button>
          </div>
          <div class="physical-item">
            <span class="name">身高、体重</span>
            <Button type="default"
                    size="small">添加</Button>
          </div>
        </div>
      </Card>
    </div>
    <div class="right-side">
      <Card style="width:250px; flex:1;">
        <div slot="title"
             class="title-wrapper">
          <span class="title">体检套餐基本信息</span>
        </div>
        <Form :model="baseData"
              :label-width="70"
              label-position="left">
          <FormItem label="套餐代码">
            <Input v-model="baseData.code"
                   size="small"
                   disabled></Input>
          </FormItem>
          <FormItem label="序号">
            <Input v-model="baseData.number"
                   size="small"></Input>
          </FormItem>
          <FormItem label="套餐名称">
            <Input v-model="baseData.name"
                   size="small"></Input>
          </FormItem>
          <FormItem label="套餐类别">
            <Select v-model="baseData.type"
                    size="small">
              <Option value="beijing">入职体检</Option>
              <Option value="shanghai">青少年体检</Option>
              <Option value="shenzhen">产前体检</Option>
            </Select>
          </FormItem>
          <FormItem label="适用性别">
            <Select v-model="baseData.type"
                    size="small">
              <Option value="beijing">不限</Option>
              <Option value="shanghai">男</Option>
              <Option value="shenzhen">女</Option>
            </Select>
          </FormItem>
          <FormItem label="拼音码">
            <Input v-model="baseData.pingyinCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="五笔码">
            <Input v-model="baseData.wubiCode"
                   size="small"></Input>
          </FormItem>
        </Form>
      </Card>
      <Card style="width:250px; margin-top:5px;">
        <div slot="title"
             class="title-wrapper">
          <span class="title">套餐价格</span>
        </div>
        <Form :model="prizeData"
              :label-width="70"
              label-position="left">
          <FormItem label="附加费用">
            <Input v-model="prizeData.extraCharge"
                   size="small"
                   disabled></Input>
          </FormItem>
          <FormItem label="套餐折扣">
            <Select v-model="prizeData.discount"
                    size="small">
              <Option value="beijing">95折</Option>
              <Option value="shanghai">9折</Option>
              <Option value="shenzhen">8折</Option>
            </Select>
          </FormItem>
          <div class="form-item">
            套餐项目总价：<span v-model="prizeData.totalPrize">1290.00</span>元
          </div>
          <div class="form-item">
            折扣金额：<span v-model="prizeData.disMoney">290.00</span>元
          </div>
          <div class="prize">折后价格：<span>1000.00</span>元</div>
          <Button type="primary"
                  style="width:100%;">保存</Button>
        </Form>
      </Card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addComboMeal',
  data () {
    return {
      baseData: {},
      prizeData: {},
      treeData: [{
        title: '所有科室与项目',
        expanded: true,
        children: [{
          title: '内科',
          expanded: true,
          children: [{
            title: '心脑血管科'
          }, {
            title: '心脏内科'
          }, {
            title: '呼吸内科'
          }]
        }, {
          title: '外科',
          children: [{
            title: "<span style='color: red'>骨外科</span>"
          }, {
            title: "<span style='color: red'>心脏外科</span>"
          }]
        }]
      }],
      columns: [
        {
          title: '项目名称',
          width: 120,
          key: 'name',
          align: 'center'
        },
        {
          title: '序号',
          key: 'sort',
          width: 80,
          align: 'center'
        },
        {
          title: '项目价格（元）',
          width: 120,
          key: 'prize',
          align: 'center'
        },
        {
          title: '折扣',
          key: 'discount',
          width: 80,
          align: 'center'
        },
        {
          title: '实际收费价格',
          key: 'curPrize',
          width: 130,
          align: 'center'
        },
        {
          title: '状态',
          width: 120,
          key: 'status',
          align: 'center'
        }
      ],
      tableData: [
        {
          name: '一般情况',
          children: [
            {
              name: '一般项目',
              sort: 1,
              prize: 5,
              discount: '9折',
              curPrize: 4.5,
              status: '启用'
            }
          ]
        }
      ]
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style lang="less">
.add-combo-meal-wrapper {
  height: 100%;
  display: flex;
  padding-right: 20px;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title-wrapper {
    padding: 5px 0;
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
  .ivu-card-body {
    display: flex;
  }
  .middle-side {
    margin-left: 5px;
    .items-wrapper {
      flex: 1;
    }
    .physical-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 5px;
      &:nth-child(odd) {
        background-color: rgba(45, 140, 240, 0.2);
      }
    }
  }
  .right-side {
    margin-left: 5px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .form-item {
      text-align: left;
      margin-bottom: 12px;
      font-size: 12px;
    }
    .prize {
      text-align: right;
      font-size: 12px;
      margin-bottom: 12px;
      span {
        font-size: 14px;
        font-weight: bold;
        color: #f16643;
      }
    }
  }
  .zk-table__cell-inner {
    text-align: center;
  }
}
.halo-tree {
  font-size: 12px;
  .node-title:hover {
    background-color: #2d8cf0;
    color: #fff;
    border-radius: 0;
  }
  .node-selected {
    color: #2d8cf0;
    background-color: #fff;
    border: none;
  }
  .tree-expand {
    border: 1px solid #2d8cf0;
    color: #2d8cf0;
  }
  li:before {
    border-left: 1px dashed #2d8cf0;
  }
  li:after {
    border-top: 1px dashed #2d8cf0;
  }
  li.leaf::after {
    border-top: 1px dashed #2d8cf0;
  }
}
</style>
