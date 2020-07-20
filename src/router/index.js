import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/vocational',
    component: Layout,
    redirect: '/vocational/course',
    name: '职业教育',
    meta: { title: '职业教育', icon: 'example' },
    children: [
      {
        path: 'user',
        name: '用户查看',
        component: () => import('@/views/user/index'),
        meta: { title: '用户查看', icon: 'table' }
      },
      {
        path: 'order',
        name: '订单查询',
        component: () => import('@/views/order/index'),
        meta: { title: '订单查询', icon: 'table' }
      },
      // {
      //   path: 'share',
      //   name: '分享记录',
      //   component: () => import('@/views/shareRecord/index'),
      //   meta: { title: '分享记录', icon: 'table' }
      // },
      {
        path: 'course',
        name: '课程查看',
        component: () => import('@/views/course/index'),
        meta: { title: '课程查看', icon: 'table' }
      },
      {
        path: 'courseAdd',
        name: '课程新增',
        component: () => import('@/views/courseAdd/index'),
        meta: { title: '课程新增', icon: 'form' }
      },
      {
        path: 'courseTag',
        name: '课程标签',
        component: () => import('@/views/courseTag/index'),
        meta: { title: '课程标签', icon: 'form' },
      },
      {
        path: 'edit',
        name: '编辑',
        component: () => import('@/views/form/index'),
        meta: { title: '编辑', icon: 'form' },
        hidden: true
      },
      {
        path : 'config',
        name : '配置',
        component: () => import('@/views/teacherCard/config'),
        meta: { title: '配置', icon: 'table' }
      }
    ]
  },

  {
    path: '/chengkao',
    component: Layout,
    redirect: '/chengkao/course',
    name: '成考辅导',
    meta: { title: '成考辅导', icon: 'example' },
    children: [
      {
        path: 'user',
        name: '用户查看',
        component: () => import('@/views/user/indexCoupon'),
        meta: { title: '用户查看', icon: 'table' }
      },
      {
        path: 'courseCouponList',
        name: '课程包列表',
        component: () => import('@/views/courseCouponList/index'),
        meta: { title: '课程包列表', icon: 'table' }
      },
      {
        path: 'courseCoupon',
        name: '课程列表',
        component: () => import('@/views/courseCoupon/index'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: 'couponList',
        name: '优惠券列表',
        component: () => import('@/views/couponList/index'),
        meta: { title: '优惠券列表', icon: 'table' }
      },
      {
        path: 'userCouponList',
        name: '用户优惠券列表',
        component: () => import('@/views/userCouponList/index'),
        meta: { title: '用户优惠券列表', icon: 'table' }
      },
      {
        path: 'order',
        name: '订单查看',
        component: () => import('@/views/couponOrder/index'),
        meta: { title: '订单查看', icon: 'table' }
      }
    ]
  },
  {
    path: '/itedu',
    component: Layout,
    name : 'it教育',
    meta: { title: 'it教育', icon: 'example' },
    children : [
      {
        path: 'user',
        name: '用户查看',
        component: () => import('@/views/itedu/itUser'),
        meta: { title: '用户查看', icon: 'table' }
      },
      {
        path: 'course',
        name: '课程查看',
        component: () => import('@/views/itedu/course'),
        meta: { title: '课程查看', icon: 'table' }
      },
      {
        path : 'ourseRecord',
        name : '看课记录',
        component: () => import('@/views/itedu/courseRecord'),
        meta: { title: '看课记录', icon: 'table' }
      },
      {
        path : 'shareRecord',
        name : '分享记录',
        component: () => import('@/views/itedu/shareRecord'),
        meta: { title: '分享记录', icon: 'table' }
      },
      {
        path : 'category',
        name : '查看分类',
        component: () => import('@/views/itedu/category'),
        meta: { title: '查看分类', icon: 'table' }
      },
      {
        path : 'addcategory',
        name : '新增分类',
        component: () => import('@/views/itedu/addcategory'),
        meta: { title: '新增分类', icon: 'table' }
      },
      {
        path : 'courseAdd',
        name : '新增课程',
        component: () => import('@/views/itedu/courseAdd'),
        meta: { title: '新增课程', icon: 'table' }
      },
      {
        path : 'bannerAdd',
        name : '新增banner',
        component: () => import('@/views/itedu/bannerAdd'),
        meta: { title: '新增banner', icon: 'table' }
      },
      {
        path : 'getBanner',
        name : '查看banner',
        component: () => import('@/views/itedu/getBanner'),
        meta: { title: '查看banner', icon: 'table' }
      },
      {
        path : 'chapterAdd',
        name : '章节新增',
        component: () => import('@/views/itedu/addChapter'),
        meta: { title: '章节新增', icon: 'table' }
      },
      {
        path : 'getChapter',
        name : '查看章节',
        component: () => import('@/views/itedu/getChapter'),
        meta: { title: '查看章节', icon: 'table' }
      },
      {
        path : 'editChapter',
        name : '修改章节',
        component: () => import('@/views/itedu/editChapter'),
        meta: { title: '修改章节', icon: 'table' },
        hidden: true
      },
      {
        path : 'childChapterAdd',
        name : '子节新增',
        component: () => import('@/views/itedu/addChildChapter'),
        meta: { title: '子节新增', icon: 'table' }
      },
      {
        path : 'getChildChapter',
        name : '查看子节',
        component: () => import('@/views/itedu/getChildChapter'),
        meta: { title: '查看子节', icon: 'table' }
      },
      {
        path : 'userShare',
        name : '分享明细',
        component: () => import('@/views/itedu/userShare'),
        meta: { title: '分享明细', icon: 'table' },
        hidden: true
      },
      {
        path : 'comments',
        name : '评论',
        component: () => import('@/views/itedu/comments'),
        meta: { title: '评论', icon: 'table' },
        hidden: true
      },
      {
        path : 'config',
        name : '配置',
        component: () => import('@/views/itedu/config'),
        meta: { title: '配置', icon: 'table' }
      }
    ]
  },
  {
    path: '/feixueli',
    redirect: '/feixueli/user',
    component: Layout,
    name : '非学历',
    meta: { title: '非学历', icon: 'example' },
    children : [
      {
        path : 'user',
        name : '用户',
        component : () => import('@/views/feixueli/user'),
        meta: { title: '用户', icon: 'table' }
      },
      {
        path : 'formUser',
        name : '表单用户',
        component : () => import('@/views/feixueli/formUser'),
        meta: { title: '表单用户', icon: 'table' }
      },
      {
        path : 'channel',
        name : '渠道',
        component : () => import('@/views/feixueli/channel'),
        meta: { title: '渠道', icon: 'table' }
      }
    ]
  },
  {
    path : '/xc',
    component: Layout,
    redirect: '/xc/user',
    name : '职业培训课',
    meta: { title: '职业培训课', icon: 'example' },
    children : [
      {
        path : 'user',
        name : '用户',
        component : () => import('@/views/xcMini/user'),
        meta: { title: '用户', icon: 'table' }
      },
      {
        path : 'formUser',
        name : '表单用户',
        component : () => import('@/views/xcMini/formUser'),
        meta: { title: '表单用户', icon: 'table' }
      },
      {
        path : 'channel',
        name : '渠道',
        component : () => import('@/views/xcMini/channel'),
        meta: { title: '渠道', icon: 'table' }
      },
      {
        path : 'project',
        name : '分类',
        component : () => import('@/views/xcMini/project'),
        meta: { title: '分类', icon: 'table' }
      },
      {
        path : 'classCategory',
        name : '项目',
        component : () => import('@/views/xcMini/classIndex'),
        meta: { title: '项目', icon: 'table' }
      },
      {
        path : 'course',
        name : '班型',
        component : () => import('@/views/xcMini/course'),
        meta: { title: '班型', icon: 'table' }
      },
      {
        path : 'courseTag',
        name : '班型标签',
        component : () => import('@/views/xcMini/courseTag'),
        meta: { title: '班型标签', icon: 'table' }
      },
      {
        path : 'courseType',
        name : '班型类型',
        component : () => import('@/views/xcMini/courseType'),
        meta: { title: '班型类型', icon: 'table' }
      },
      {
        path : 'courseSlogan',
        name : '班型亮点',
        component : () => import('@/views/xcMini/courseSlogan'),
        meta: { title: '班型亮点', icon: 'table' }
      },
      {
        path : 'shareUser',
        name : '邀请列表',
        component : () => import('@/views/xcMini/shareUserList'),
        meta: { title: '邀请列表', icon: 'table' },
        hidden: true
      },
      {
        path : 'squad',
        name : '拼团列表',
        component : () => import('@/views/xcMini/squad'),
        meta: { title: '拼团列表', icon: 'table' },
      },
      {
        path : 'courseData',
        name : '资料管理',
        component : () => import('@/views/xcMini/courseData'),
        meta: { title: '资料管理', icon: 'table' },
      }
    ]
  },
  {
    path : '/xc_form',
    component: Layout,
    name : '职业培训表单管理',
    meta: { title: '职业培训表单管理', icon: 'example' },
    children : [
      {
        path : 'formUser',
        name : '表单用户',
        component : () => import('@/views/xcMini/formUser'),
        meta: { title: '表单用户', icon: 'table' }
      },
      {
        path : 'channel',
        name : '渠道',
        component : () => import('@/views/xcMini/channel'),
        meta: { title: '渠道', icon: 'table' }
      },
    ]
  },

  { path: '/detail', component: () => import('@/views/articleDetail'), hidden: true },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
