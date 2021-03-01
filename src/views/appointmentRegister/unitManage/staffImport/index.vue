<template>
    <div class="staff-import-wrapper">
        <Card style="width:100%">
            <div slot="title"
                class="search-title-wrapper">
                <span class="title">表格导入名单</span>
                <div class="title-right-tool">
                    <Button type="primary"
                            style="margin-left:10px;">表格导入</Button>
                    <Button type="primary"
                            style="margin-left:10px;">保存</Button>
                    <Button type="default"
                            style="margin-left:10px;">清空</Button>
                </div>
            </div>
            <div class="page-body clearfix">
               
            </div>
            <div class="page-footer">
                <Page :total="totalSize"
                    :page-size="pageSize"
                    :current="pageIndex"
                    :page-size-opts="[10,20,40,100]"
                    size="small"
                    show-sizer
                    show-elevator
                    show-total />
            </div>
        </Card>
    </div>
</template>
<script>
export default {
    name: 'staffImport',
    data() {
        return{
            totalSize: 100,
            pageSize: 1,
            pageIndex: 20,
        }
    }
}
</script>
<style lang="less">
.staff-import-wrapper{
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  position: relative;
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
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>
