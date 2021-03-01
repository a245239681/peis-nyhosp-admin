<template>
  <div class="package-input-drop">
    <div v-click-outside.capture="onClickOutside"
         v-click-outside:mousedown.capture="onClickOutside">
      <div ref="inputBox"
           @keydown.esc="handleKeydown"
           @keydown.enter="handleKeydown"
           @keydown.up.prevent="handleKeydown"
           @keydown.down.prevent="handleKeydown"
           @keydown.tab="handleKeydown"
           @keydown.delete="handleKeydown">
        <Input v-model="filterText"
               clearable
               size="small"
               :placeholder="placeholder"
               :style="{width: width + 'px'}"
               @on-change="search"
               @on-clear="clear"
               :disabled="disabled" />
      </div>
      <transition name="dropdown">
        <ul class="drop-menu"
            v-show="isVisible"
            ref="dropDownMenu">
          <li v-for="(item, index) in dataList"
              :class="{'select-focus':index == focusIndex}"
              :key="index"
              @click="selectOption(index)">{{ item.name }}</li>
          <li v-show="!isLoading && !this.dataList.length"
              style="color:#c5c8ce;">无匹配数据</li>
          <li v-show="isLoading"
              style="color:#c5c8ce;">加载中</li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import { directive as clickOutside } from 'v-click-outside-x';

export default {
  name: 'InputDrop',
  directives: { clickOutside },
  props: {
    dropList: {
      type: Array,
      default: () => []
    },
    width: [String, Number],
    placeholder: String,
    isLoading: Boolean,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isVisible: false,
      focusIndex: -1,
      filterText: '',
      dataList: [],
      active: false
    }
  },
  watch: {
    disabled () {
      console.log('我改变了')
      console.log(this.disabled)
    },
    //避免修改props
    dropList () {
      this.dataList = Object.assign([], this.dropList)
    },
    focusIndex (index) {
      this.$nextTick(() => {
        let dropMenuViewHeight = this.$refs.dropDownMenu.clientHeight - this.$refs.dropDownMenu.children[index].clientHeight
        let topViewHeight = this.$refs.dropDownMenu.scrollTop + this.$refs.dropDownMenu.children[index].clientHeight
        // 按上键往上选择时， 重新定义滚动条高度
        if (this.$refs.dropDownMenu.children[index].offsetTop > dropMenuViewHeight) {
          if ((this.$refs.dropDownMenu.children.length - 1) == index) {
            this.$refs.dropDownMenu.scrollTop = this.$refs.dropDownMenu.scrollHeight
          } else {
            this.$refs.dropDownMenu.scrollTop += this.$refs.dropDownMenu.children[index].offsetHeight
          }
        }
        // 按下键往下选择时， 重新定义滚动条高度
        if (this.$refs.dropDownMenu.children[index].offsetTop < topViewHeight) {
          if (index == 0) {
            this.$refs.dropDownMenu.scrollTop = 0
          } else {
            this.$refs.dropDownMenu.scrollTop -= this.$refs.dropDownMenu.children[index].offsetHeight
          }
        }
      })
    }
  },
  methods: {
    resetOptions () {
      this.isVisible = false;
      this.dataList = []
    },
    selectOption (index) {
      // console.log('我点击选项')
      // console.log(index)
      let label = this.dataList[index].name
      let value = this.dataList[index].id
      this.$emit('selectOption', value, label)
      this.resetOptions()
    },
    onClickOutside (event) {
      //  console.log('我点击外部')
      // console.log(event)
      if (this.isVisible) {
        if (event.type === 'mousedown') {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        this.isVisible = false;
      } else {
      }
    },
    handleKeydown (e) {
      console.log(e)
      if (e.key === 'Backspace') {
        return; // so we don't call preventDefault
      }

      if (this.isVisible) {
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
          this.navigateOptions(-1);
        }
        // prev
        if (e.key === 'ArrowDown') {
          this.navigateOptions(1);
        }
        // enter
        if (e.key === 'Enter') {
          if (this.focusIndex == -1) return
          this.selectOption(this.focusIndex)
        }
      }
    },
    navigateOptions (direction) {
      if (!this.dataList) return
      const optionsLength = this.dataList.length - 1;
      let index = this.focusIndex + direction;
      if (index < 0) index = optionsLength;
      if (index > optionsLength) index = 0;
      this.focusIndex = index;
    },
    search () {
      if (!this.filterText) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
      }
      this.$emit('search', this.filterText)
    },
    clear () {
      this.isVisible = false;
      this.$emit('clear')
    }
  }
}
</script>

<style lang="less" scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: height 10s;
}
.dropdown-enter, .dropdown-leave-to /* .fade-leave-active below version 2.1.8 */ {
  height: 0;
}
</style>

<style lang="less">
.package-input-drop {
  position: relative;
  width: 100%;
  .drop-menu {
    width: 240px;
    max-height: 240px;
    overflow-y: auto;
    position: absolute;
    box-sizing: border-box;
    top: 30px;
    left: 0;
    z-index: 10;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    margin: 5px 0;
    overflow: auto;
    .select-focus {
      background-color: #d6eaff;
    }
    li {
      line-height: 24px;
      font-size: 14px;
      padding: 5px 10px;
      // border-bottom: 1px solid #f3f3f3;
      &:hover {
        background-color: #f3f3f3;
      }
    }
  }
}
</style>

