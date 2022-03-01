import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/IndexView.vue"),
    },
    {
      path: "/",
      component: () => import("@/views/layout/IndexView.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/home/IndexView.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "error-page",
      component: () => import("@/views/error-page/IndexView.vue"),
    },
  ],
});

export default router;
