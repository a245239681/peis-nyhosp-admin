<template>
    <!-- 用户信息卡片 -->
    <div class="profile-wrapper">
        <div class="user-photo">
            <img src="@/assets/images/userPhoto.png" alt="用户头像">
        </div>
        <div class="profile-info">
            <Form :model="userForm" label-position="left" :label-width="60" inline>
                <div class="profile-info-wrapper">
                    <FormItem label="编号">
                        <Input type="text" v-model="userForm.id" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="体检号">
                        <Input type="text" v-model="userForm.examNo" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="手机号码">
                        <Input type="text" v-model="userForm.phone" disabled>
                        </Input>
                    </FormItem>
                </div>
                <div class="profile-info-wrapper">
                    <FormItem label="姓名">
                        <Input type="text" v-model="userForm.username" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="年龄">
                        <Input type="text" v-model="userForm.age" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="性别">
                        <Input type="text" v-model="userForm.sex" disabled>
                        </Input>
                    </FormItem>
                </div>
                <div class="profile-info-wrapper">
                    <FormItem label="婚姻状态">
                        <Input type="text" v-model="userForm.married" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="证件类型">
                        <Input type="text" v-model="userForm.certType" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="证件号码">
                        <Input type="text" v-model="userForm.certNo" disabled>
                        </Input>
                    </FormItem>
                </div>
            </Form>
        </div>
        <div class="exam-info">
                <Form :model="examForm" label-position="left" :label-width="74">
                <FormItem label="体检类型">
                    <Input v-model="examForm.type" disabled></Input>
                </FormItem>
                <FormItem label="体检套餐">
                    <Input v-model="examForm.package" disabled></Input>
                </FormItem>
                <FormItem label="过量辐射史">
                    <Input v-model="examForm.overRadiation" disabled></Input>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'profileInfo',
    data() {
        return {
            userForm: {
            id: '21313213213',
            examNo: '2321321214',
            phone: '13457662055',
            username: '张三',
            age: '29',
            sex: '男',
            married: '已婚',
            certType: '身份证',
            certNo: '450130198004040423'
            }, 
            examForm: {
                type: '',
                package: '霸王餐',
                overRadiation: '无'
            }
        }
    }
}
</script>

<style lang="less">
.profile-wrapper {
    width: 100%;
    min-width: 1200px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 20px 0;
    .user-photo{
    width: 10%;
    min-width: 140px;
        img{
            width: 80%;
            height: 80%;
        }
    }
    .profile-info{
        width: 60%;
        min-width: 680px;
        border-right: 1px solid #eee;
        .ivu-input{
          color: #000;
        }
        &-wrapper{
            width:100%;
        }
    }
    .exam-info{
        box-sizing: border-box;
        width: 30%;
        min-width: 180px;
        padding: 0 30px 0 20px;
        .ivu-input{
            color: #000;
        }
    }
}
</style>
