import { defineStore } from "pinia";

export const useBreadcrumbStore = defineStore({
  id: "breadcrumb",
  state: () => ({
    breadcrumbs: [
      {
        title: "user",
        path: "/user",
      },
      {
        title: "admin",
        path: "",
      },
    ],
  }),
  getters: {},
  actions: {},
});
