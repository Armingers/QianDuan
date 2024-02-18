// 路由配置
import Vue from 'vue'
import Router from 'vue-router'
const routerPush = Router.prototype.push
Vue.use(Router)

const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/user/login.vue'),
  },
  {
    path: '/index',
    name: '首页',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/forget',
    name: '忘记密码',
    component: () => import('@/views/user/changePassword.vue')
  },
  {
    path: '/register',
    name: '注册',
    component: () => import('@/views/user/register.vue')
  },
  {
    path: '/upload',
    name: '上传',
    component: () => import('@/views/upload.vue')
  },
  {
    path: '/searchGoods',
    name: '寻物',
    component: () => import('@/views/searchGoods.vue')
  },
  {
    path: '/getGoods',
    name: '招领',
    component: () => import('@/views/getGoods.vue')
  },
  {
    path: '/messageBoard',
    name: '留言板',
    component: () => import('@/views/messageBoard.vue')
  },
  {
    path: '/admin',
    name: '管理员界面',
    component: () => import('@/views/admin/userManage/userManage.vue')
  },
  {
    path: '/admin/user',
    name: '用户管理界面',
    component: () => import('@/views/admin/userManage/userManage.vue')
  },
  {
    path: '/admin/lost',
    name: '失物管理界面',
    component: () => import('@/views/admin/lostManage/lostManage.vue')
  },
  {
    path: '/admin/found',
    name: '招领管理界面',
    component: () => import('@/views/admin/foundManage/foundManage.vue')
  },
  {
    path: '/admin/liveword',
    name: '留言板管理界面',
    component: () => import('@/views/admin/msgManage/msgManage.vue')
  },
  {
    path: '/admin/tips',
    name: '小标题管理界面',
    component: () => import('@/views/admin/othersManage/tipsManage.vue')
  },
  {
    path: '/admin/tips',
    name: '小标题管理界面',
    component: () => import('@/views/admin/othersManage/tipsManage.vue')
  },
  {
    path: '/search',
    name: '查询界面',
    component: () => import('@/views/search.vue')
  }
]

const router = new Router({
  // mode: 'history', history模式下，URL中不带#符号，例如http://example.com/home，看起来更加美观。创建Router实例
  routes
})

Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error)
}

export default router
