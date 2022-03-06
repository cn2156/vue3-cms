<script setup>
import { ref, reactive } from "vue";
import md5 from "md5";
import UploadFile from "@/components/UploadFile.vue";
import {
  getUser,
  getFields,
  getStatuses,
  getStatusDefaultValue,
  getAllowBackendsValues,
} from "../../../api/user";

const props = defineProps({
  id: {
    type: [String, Number],
    default: "",
  },
});

const fields = getFields();
const statuses = getStatuses();
const allowBackendsValues = getAllowBackendsValues();

const loading = ref(false);
const formRef = ref();
let form = ref({
  phone: "",
  pwd: "",
  name: "",
  avatar: "",
  allow_backend: allowBackendsValues.ENABLED,
  status: getStatusDefaultValue(),
});

let oldPwd = "";
const getUserInfo = async (id) => {
  const data = await getUser({ id });
  if (data.code === "000000" && data.data) {
    form.value = data.data;
    // 有密码置空，以便于不修改密码
    if (data.data.pwd) {
      oldPwd = data.data.pwd;
      form.value.pwd = "";
      rules.pwd[0].required = false;
    }
  }
};
if (props.id) {
  getUserInfo(props.id);
}

const checkAllowBackend = (rule, value) => {
  if (!oldPwd) {
    rules.pwd[0].required = value;
    if (!value) {
      formRef.value.clearValidate("pwd");
    }
  }
  return true;
};

const rules = reactive({
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
    {
      pattern: /^1\d{10}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },
  ],
  pwd: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      max: 12,
      message: "密码6~12位",
      trigger: "blur",
    },
  ],
  allow_backend: [
    {
      validator: checkAllowBackend,
      trigger: "change",
    },
  ],
  status: [
    {
      required: true,
      message: "请选择状态",
      trigger: "blur",
    },
  ],
});

import { createOrUpdateUser } from "@/api/user";
import { useRouter } from "vue-router";
const router = useRouter();

import { ElMessage } from "element-plus";

const submitForm = async (formEl) => {
  if (!formEl) return;

  try {
    await formEl.validate();
    loading.value = true;

    // 有密码：密码为空时表示不修改密码
    const formData = { ...form.value };
    formData.pwd = formData.pwd ? md5(formData.pwd) : oldPwd ? oldPwd : "";

    const data = await createOrUpdateUser(formData);
    if (data.code === "000000") {
      ElMessage.success("保存成功");
      router.push({ name: "user" });
    } else {
      ElMessage.error(data.message);
    }
    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item :label="fields.phone" prop="phone">
      <el-input v-model="form.phone" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item :label="fields.name" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item :label="fields.avatar" prop="avatar">
      <UploadFile v-model:avatar="form.avatar" />
    </el-form-item>
    <el-form-item :label="fields.allow_backend" prop="allow_backend">
      <el-switch
        v-model="form.allow_backend"
        :active-value="allowBackendsValues.ENABLED"
        :inactive-value="allowBackendsValues.DISABLED"
      ></el-switch>
    </el-form-item>
    <el-form-item :label="fields.pwd" prop="pwd">
      <el-input
        type="password"
        v-model="form.pwd"
        :placeholder="form.id ? '不更改密码请留空' : ''"
      ></el-input>
    </el-form-item>
    <el-form-item :label="fields.status">
      <el-select v-model="form.status" placeholder="请选择状态">
        <el-option
          v-for="(status, key) in statuses"
          :key="key"
          :label="status"
          :value="key"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)" :loading="loading">
        保 存
      </el-button>
      <el-button type="primary" @click="submitForm(formRef)" :loading="loading">
        重 置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
