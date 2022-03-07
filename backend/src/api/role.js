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
  name: {
    text: "角色名称",
  },
  code: {
    text: "角色编码",
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
  ACTIVED: {
    text: "已启用",
    value: "1",
    color: "success",
  },
  DISABLED: {
    text: "已禁用",
    value: "0",
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
 * 获得角色信息
 * @param {Object} params 参数
 * @returns {Object}
 */
export const getRole = async (params) => {
  const res = await request({
    method: "GET",
    url: "/role",
    params,
  });

  let data = {};
  if (res.code === "000000") {
    data = res.data[0];
  }

  return { ...res, data };
};

/**
 * 获得角色列表
 * @param {Object} params 参数
 * @returns {Object}
 */
export const getRoles = async (params) => {
  params._sort = "id";
  params._order = "desc";

  const res = await request({
    method: "GET",
    url: "/role",
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
    url: "/role",
    params,
  });

  return res.data.length;
};

/**
 * 添加或更新角色
 * @param {Object} data 数据
 * @returns {Object}
 */
export const createOrUpdateRole = async (data) => {
  if (data.id) {
    return updateRole(data);
  } else {
    return createRole(data);
  }
};

/**
 * 添加
 * @param {Object}} data 参数
 */
export const createRole = (data) =>
  request({
    method: "POST",
    url: "/role",
    data,
  });

/**
 * 更新角色
 * @param {Object} data 数据
 * @returns {Object}
 */
export const updateRole = (data) =>
  request({
    method: "PUT",
    url: `/role/${data.id}`,
    data,
  });

/**
 * 删除角色
 * @param {Number}} id ID
 * @returns {Object}
 */
export const deleteRole = (id) =>
  request({
    method: "DELETE",
    url: `/role/${id}`,
  });
