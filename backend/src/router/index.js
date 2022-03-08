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
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/home/IndexView.vue"),
        },
        {
          path: "user",
          component: () => import("@/views/user/IndexView.vue"),
          children: [
            {
              path: "",
              name: "user",
              component: () => import("@/views/user/AdminView.vue"),
            },
            {
              path: "create",
              name: "user-create",
              component: () => import("@/views/user/CreateView.vue"),
            },
            {
              path: ":id/update",
              name: "user-update",
              component: () => import("@/views/user/UpdateView.vue"),
              props: true,
            },
            {
              path: ":id",
              name: "user-read",
              component: () => import("@/views/user/ReadView.vue"),
              props: true,
            },
          ],
        },
        {
          path: "role",
          component: () => import("@/views/role/IndexView.vue"),
          children: [
            {
              path: "",
              name: "role",
              component: () => import("@/views/role/AdminView.vue"),
            },
            {
              path: ":id/resource",
              name: "role-resource",
              component: () => import("@/views/role/RoleResource.vue"),
              props: true,
            },
          ],
        },
        {
          path: "category",
          component: () => import("@/views/category/IndexView.vue"),
          children: [
            {
              path: "",
              name: "category",
              component: () => import("@/views/category/AdminView.vue"),
            },
            {
              path: "create",
              name: "category-create",
              component: () => import("@/views/category/CreateView.vue"),
            },
            {
              path: ":id/update",
              name: "category-update",
              component: () => import("@/views/category/UpdateView.vue"),
              props: true,
            },
            {
              path: ":id",
              name: "category-read",
              component: () => import("@/views/category/ReadView.vue"),
              props: true,
            },
          ],
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

import { useUserStore } from "@/stores/user";

router.beforeEach((to) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    const userStore = useUserStore();
    if (!userStore.user) {
      return {
        name: "login",
        query: {
          redirect: to.fullPath,
        },
      };
    }
  }
});

export default router;
