import axios from '@/libs/api.request'

// 获取菜单列表
export const getMenuList = (params) => {
  return axios.request({
    url: '/power/menu/listTree',
    method: 'post',
    data: params
  })
}

// 添加、修改菜单
export const editMenu = (params) => {
  return axios.request({
    url: '/power/menu/save',
    method: 'post',
    data: params
  })
}

// 删除菜单
export const deleteMenu = (params) => {
  return axios.request({
    url: '/power/menu/delete',
    method: 'post',
    data: params
  })
}
