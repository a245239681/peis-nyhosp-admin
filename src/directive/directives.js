import { on } from '@/libs/tools'
import Router from '@/router/index'

const directives = {
  draggable: {
    inserted: (el, binding, vnode) => {
      let triggerDom = document.querySelector(binding.value.trigger)
      triggerDom.style.cursor = 'move'
      let bodyDom = document.querySelector(binding.value.body)
      let pageX = 0
      let pageY = 0
      let transformX = 0
      let transformY = 0
      let canMove = false
      const handleMousedown = e => {
        let transform = /\(.*\)/.exec(bodyDom.style.transform)
        if (transform) {
          transform = transform[0].slice(1, transform[0].length - 1)
          let splitxy = transform.split('px, ')
          transformX = parseFloat(splitxy[0])
          transformY = parseFloat(splitxy[1].split('px')[0])
        }
        pageX = e.pageX
        pageY = e.pageY
        canMove = true
      }
      const handleMousemove = e => {
        let xOffset = e.pageX - pageX + transformX
        let yOffset = e.pageY - pageY + transformY
        if (canMove) bodyDom.style.transform = `translate(${xOffset}px, ${yOffset}px)`
      }
      const handleMouseup = e => {
        canMove = false
      }
      on(triggerDom, 'mousedown', handleMousedown)
      on(document, 'mousemove', handleMousemove)
      on(document, 'mouseup', handleMouseup)
    },
    update: (el, binding, vnode) => {
      if (!binding.value.recover) return
      let bodyDom = document.querySelector(binding.value.body)
      bodyDom.style.transform = ''
    }
  },
  permission: {
    inserted (el, binding, vnode) {
      const { value } = binding
      const roles = Router.currentRoute.meta.authority
      if (value && value instanceof Array && value.length > 0) {
        const permissionRoles = value
        const hasPermission = roles.some(role => {
          return permissionRoles.includes(role)
        })
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error(`need roles! Like v-permission="['add','del']"`)
      }
    }
  },
  tabindex: {
    inserted (el, binding, vnode) {
      const { value } = binding
      if (typeof (value) === 'number') {
        setTimeout(function () {
          let _input = el.getElementsByTagName('input')[0]
          let _textarea = el.getElementsByTagName('textarea')[0]
          _input && _input.setAttribute('tabindex', value)
          _textarea && _textarea.setAttribute('tabindex', value)
        })
      } else {
        throw new Error(`need roles! Like v-taindex="-1"`)
      }
    }
  },
  keydirection: {
    inserted (el, binding, vnode) {
      const { value } = binding
      if (typeof (value) === 'number') {
        setTimeout(function () {
          console.log(el.getAttribute('data-selfidx'))
          console.log(value)
          let _input = el.getElementsByTagName('input')[0]
          if (_input && el.getAttribute('data-selfidx') == value) {
            console.log(111)
            _input.focus()
          }
        })
      } else {
        throw new Error(`need roles! Like v-taindex="-1"`)
      }
    }
  },

  // 拖拽辅助钩子，超出网址栏设定top为0
  dragForbid: {
    inserted (el, binding, vnode) {
      let element = el.getElementsByClassName('ivu-modal-header')[0]
      element.onmousedown = function (e) {
        e.preventDefault()
        e.stopPropagation()
        document.onmousemove = function (e) {
          // el.style.left = e.pageX - disx + 'px';
          // el.style.top = e.pageY - disy + 'px';
        }
        document.onmouseup = function (e) {
          let adiv = el.getElementsByClassName('ivu-modal-content')[0]
          if (adiv.style.top.split('px')[0] <= 0) {
            adiv.style.top = '0px'
          }
          document.onmouseup = document.onmousemove = null
        }
      }
    }
  }
}

export default directives
