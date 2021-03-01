<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Avatar :src="userAvator" /> -->
      <span>{{userName}}</span>
      <Icon :size="18"
            type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="changePassword">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Edit :visible="editModalVisible"
          ref="editwrapper"
          @close="closeEditModal"
          @logout="logout"></Edit>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import Edit from './edit'
// import store from '@/store'

export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    }
  },
  components: {
    Edit
  },
  data () {
    return {
      editModalVisible: false
    }
  },
  methods: {
    ...mapActions(['handleLogOut']),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            // store.commit('reset')
            window.location.reload()
            this.$router.push({
              name: 'login'
            })
          })
          break
        case 'changePassword':
          // console.log('修改密码')
          this.editModalVisible = true
          this.$refs.editwrapper.formData = {}
          this.$refs.editwrapper.$refs.form.resetFields()
          break
      }
    },
    closeEditModal () {
      this.editModalVisible = false
    },
    logout () {
      this.editModalVisible = false
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    }
  }
}
</script>
