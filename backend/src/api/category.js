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
  display_order: {
    text: "显示顺序",
  },
  name: {
    text: "栏目名称",
  },
  code: {
    text: "栏目编码",
  },
  parent_id: {
    text: "所属栏目",
  },
  cover_img: {
    text: "栏目图片",
  },
  desc: {
    text: "栏目简介",
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
 * 获得栏目信息
 * @param {Object} params 参数
 * @returns {Object}
 */
export const getCategory = async (params) => {
  const res = await request({
    method: "GET",
    url: "/category",
    params,
  });

  let data = {};
  if (res.code === "000000") {
    data = res.data[0];
  }

  return { ...res, data };
};

/**
 * 获得栏目列表
 * @param {Object} params 参数
 * @returns {Object}
 */
export const getCategories = async (params) => {
  params._sort = "display_order,id";
  params._order = "desc,asc";

  const res = await request({
    method: "GET",
    url: "/category",
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
    url: "/category",
    params,
  });

  return res.data.length;
};

/**
 * 获得一级栏目
 * @param {Object} params 参数
 * @returns {Object}
 */
export const getOneLevelCategories = async (params = {}) => {
  params.parent_id = 0;
  params._sort = "display_order,id";
  params._order = "desc,asc";

  const res = await request({
    method: "GET",
    url: "/category",
    params,
  });

  const statusesValues = getStatuses();

  if (res.code === "000000") {
    res.data.forEach((item, index) => {
      res.data[index].statusText = statusesValues[item.status];
      res.data[index].nameWithStatus =
        item.name +
        (item.status === statuses.ACTIVED.value
          ? ""
          : " [" + statusesValues[item.status] + "]");
    });
  }

  return res;
};

/**
 * 获得一级栏目值和名称
 * @returns {Array}
 */
export const getOneLevelCategoryValues = async () => {
  const res = await getOneLevelCategories();
  let data = [];
  res.data.forEach((item) => {
    data[item.id] = item.name;
  });

  return { code: res.code, data, message: res.message };
};

/**
 * 创建或更新栏目
 * @param {Object} data 数据
 * @returns {Object}
 */
export const createOrUpdateCategory = (data) => {
  if (data.id) {
    return updateCategory(data);
  } else {
    return createCategory(data);
  }
};

/**
 * 添加
 * @param {Object}} data 参数
 */
export const createCategory = (data) =>
  request({
    method: "POST",
    url: "/category",
    data,
  });

/**
 * 更新栏目
 * @param {Object} data 数据
 * @returns {Object}
 */
export const updateCategory = (data) =>
  request({
    method: "PUT",
    url: `/category/${data.id}`,
    data,
  });

/**
 * 删除栏目
 * @param {Object} id ID
 * @returns {Object}
 */
export const deleteCategory = (id) =>
  request({
    method: "DELETE",
    url: `/category/${id}`,
  });
