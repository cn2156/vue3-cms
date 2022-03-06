/**
 * 网络请求
 */
import axios from "axios";
import configApi from "@/config/api";

// 初始化
const request = axios.create({
  baseURL: configApi.baseUrl,
});

import { useUserStore } from "@/stores/user";

// 请求拦截器
request.interceptors.request.use((config) => {
  // 去掉空值
  for (let item in config.params) {
    if (config.params[item] === "") {
      delete config.params[item];
    }
  }

  // 发送授权
  const userStore = useUserStore();
  if (userStore.user) {
    config.headers.Authorization = "Bear ";
  }

  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 2xx
    return {
      code: "000000",
      data: response.data,
      message: "",
    };
  },
  (error) => {
    // 4xx、5xx
    let message = "未知错误";
    if (error.response) {
      message = error.response.statusText;
      if (error.response.status === 404) {
        message = "没有找到资源";
      }
    } else if (error) {
      message = error.message;
    }
    return {
      code: "-1",
      data: [],
      message,
    };
    // return Promise.reject(error);
  }
);

export default request;
