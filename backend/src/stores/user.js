import { defineStore } from "pinia";

const USER_KEY = "cms_user";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user: JSON.parse(window.localStorage.getItem(USER_KEY) || null),
  }),
  getters: {},
  actions: {
    setUser(payload) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(payload));
      this.user = payload;
    },
  },
});
