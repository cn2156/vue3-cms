import request from "../utils/request";
import {
  getObjectPropertyValue,
  getObjectProperties,
  getObjectValueProperties,
} from "../utils/tools";

/**
 * 字段
 */
const fields = {
  id: {
    text: "ID",
  },
  phone: {
    text: "手机号",
  },
  pwd: {
    text: "密码",
  },
  name: {
    text: "姓名",
  },
  avatar: {
    text: "头像",
  },
  allow_backend: {
    text: "允许登录后台",
  },
  source: {
    text: "来源",
  },
  status: {
    text: "状态",
  },
};

/**
 * 获得字段文本
 * @param {String}} field 字段
 * @returns {String}
 */
export const getFieldText = (field) =>
  getObjectPropertyValue(fields, "text", field);

/**
 * 获得字段和文本
 * @returns {Object}
 */
export const getFields = () => getObjectProperties(fields, "text");

/**
 * 状态
 */
const statuses = {
  NOT_REVIEWED: {
    text: "未审核",
    value: "0",
    color: "primary",
  },
  ACTIVED: {
    text: "已启用",
    value: "1",
    color: "success",
  },
  DISABLED: {
    text: "已禁用",
    value: "2",
    color: "danger",
  },
};

/**
 * 获得状态文本
 * @param {Nubmer} status 状态
 * @returns {String}
 */
export const getStatusText = (status) =>
  getObjectPropertyValue(statuses, "text", status);

/**
 * 获得状态颜色
 * @returns {Object}
 */
export const getStatusColors = () =>
  getObjectValueProperties(statuses, "color");

/**
 * 获得状态值和文本
 * @returns {Object}
 */
export const getStatuses = () => getObjectValueProperties(statuses, "text");

/**
 * 获得状态默认值
 * @returns {Number}
 */
export const getStatusDefaultValue = () => statuses.ACTIVED.value;

/**
 * 是否可以登录后台
 */
const allowBackends = {
  ENABLED: {
    text: "是",
    value: 1,
    color: "success",
  },
  DISABLED: {
    text: "否",
    value: 0,
    color: "danger",
  },
};

/**
 * 获得是否可以登录后台属性和值
 * @returns {Object}
 */
export const getAllowBackendsValues = () => getObjectProperties(allowBackends);

/**
 * 获得是否可以登录后台值和文本
 * @returns {Object}
 */
export const getAllowBackends = () =>
  getObjectValueProperties(allowBackends, "text");

/**
 * 来源
 */
const sources = {
  BACKEND: {
    text: "后台",
    value: 1,
    color: "success",
  },
  FRONTEND: {
    text: "前台",
    value: 0,
    color: "danger",
  },
};

/**
 * 获得来源文本
 * @param {Number} source 来源
 * @returns {String}
 */
export const getSourceText = (source) =>
  getObjectPropertyValue(sources, "text", source);

/**
 * 获得来源颜色
 * @returns {Object}
 */
export const getSourceColors = () => getObjectValueProperties(sources, "color");

/**
 * 获得来源值和文本
 * @returns {Object}
 */
export const getSources = () => getObjectValueProperties(sources, "text");

/**
 * 登录
 * @param {Object}} params 参数
 * @returns {Object}
 */
export const login = async (params) => {
  // 状态启用
  params.status = statuses.ACTIVED.value;
  // 可以登录后台
  params.allow_backend = allowBackends.ENABLED.value;

  // 查询
  const data = await request({
    method: "GET",
    url: "/user",
    params,
  });

  // 手机号或密码不正确
  if (data.code === "000000") {
    if (data.data.length === 0) {
      data.code = "-1";
      data.data[0] = [];
      data.message = "手机号或密码不正确";
    }
  } else {
    data.data[0] = [];
  }

  return { code: data.code, data: data.data[0], message: data.message };
};

/**
 * 获得用户信息
 * @param {Object} params 参数
 * @returns {Object}
 */
export const getUser = async (params) => {
  const res = await request({
    method: "GET",
    url: "/user",
    params,
  });

  let data = {};
  if (res.code === "000000") {
    data = res.data[0];
  }

  return { ...res, data };
};

/**
 * 获得用户列表
 * @param {Object} params 参数
 * @returns {Object}
 */
export const getUsers = async (params) => {
  params._sort = "id";
  params._order = "desc";

  const res = await request({
    method: "GET",
    url: "/user",
    params,
  });
  const total = await getTotal(params);

  return { ...res, total };
};

/**
 * 获得记录条数
 * @param {Object}} params 参数
 * @returns {Number}
 */
export const getTotal = async (params) => {
  if (params._page) {
    delete params._page;
  }
  if (params._limit) {
    delete params._limit;
  }
  if (params._sort) {
    delete params._sort;
  }
  if (params._order) {
    delete params._order;
  }

  const res = await request({
    method: "GET",
    url: "/user",
    params,
  });

  return res.data.length;
};

/**
 * 创建或更新用户
 * @param {Object} data 数据
 * @returns {Object}
 */
export const createOrUpdateUser = async (data) => {
  if (data.id) {
    return updateUser(data);
  } else {
    return createUser(data);
  }
};

/**
 * 添加
 * @param {Object}} data 参数
 */
export const createUser = async (data) => {
  // search
  const res = await getUsers({ phone: data.phone });
  if (res.code === "000000" && res.data.length > 0) {
    return {
      code: "-1",
      data: [],
      message: "手机号已经存在",
    };
  }

  // banckend
  data.source = sources.BACKEND.value;

  return request({
    method: "POST",
    url: "/user",
    data,
  });
};

/**
 * 创建会员
 * @param {Object} data 数据
 * @returns {Object}
 */
// export const createMember = (data) =>
//   request({
//     method: "POST",
//     url: "/user",
//     data,
//   });

/**
 * 更新用户
 * @param {Object} data 数据
 * @returns {Object}
 */
export const updateUser = async (data) => {
  // search
  const res = await getUsers({ phone: data.phone });
  if (res.code === "000000" && res.data.length > 0) {
    if (res.data[0].id !== data.id) {
      return {
        code: "-1",
        data: [],
        message: "手机号已经存在，不能更换",
      };
    }
  }

  return request({
    method: "PUT",
    url: `/user/${data.id}`,
    data,
  });
};

/**
 * 删除用户
 * @param {Object} id ID
 * @returns {Object}
 */
export const deleteUser = (id) =>
  request({
    method: "DELETE",
    url: `/user/${id}`,
  });
