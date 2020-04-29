import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // 进度条样式

Vue.use(VueRouter);

const routes = [
  {
    path: "/user",
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/UserLayout"),
    children: [
      // 重定向
      {
        path: "/user",
        redirect: "/user/login"
      },
      // 登录页
      {
        path: "/user/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/User/Login")
      },
      // 注册页
      {
        path: "/user/register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "register" */ "../views/User/Register")
      }
    ]
  },

  // 首页
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/BasicLayout"),
    children: [
      // 重定向
      {
        path: "/",
        name: "home",
        redirect: "/plan"
      },
      // 日历
      {
        path: "/calendar",
        name: "calendar",
        component: () =>
          import(/* webpackChunkName: "calendar" */ "../views/Calendar")
      },
      // 计划
      {
        path: "/plan",
        name: "plan",
        component: () =>
          import(/* webpackChunkName: "plan" */ "../layouts/PlanLayout"),
        children: [
          // 重定向
          {
            path: "/plan",
            redirect: "/plan/today"
          },
          // 今日计划
          {
            path: "/plan/*",
            name: "plan today",
            component: () =>
              import(/* webpackChunkName: "plan" */ "../views/Plan")
          }
        ]
      },
      // 帮助
      {
        path: "/help",
        name: "help",
        component: () => import(/* webpackChunkName: "help" */ "../views/Help")
      },
      // 关于
      {
        path: "/about",
        name: "about",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/About")
      }
    ]
  },

  // Exception
  {
    path: "/403",
    name: "403",
    component: () =>
      import(/* webpackChunkName: "fail" */ "../views/Exception/403")
  },
  {
    path: "/404",
    name: "404",
    component: () =>
      import(/* webpackChunkName: "fail" */ "../views/Exception/404")
  },
  {
    path: "/500",
    name: "500",
    component: () =>
      import(/* webpackChunkName: "fail" */ "../views/Exception/500")
  },
  { path: "*", redirect: "/404" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开始进度条
  next(); // 确保要调用 next 方法，否则钩子就不会被 resolved。
});

router.afterEach(() => {
  NProgress.done(); // 结束进度条
});

export default router;
