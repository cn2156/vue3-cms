<script setup>
import { ref, reactive } from "vue";
import md5 from "md5";

const loading = ref(false);
const formRef = ref();
const form = reactive({
  phone: "",
  pwd: "",
});

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
  pwd: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
});

import { login } from "@/api/user";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

import { ElMessage } from "element-plus";

const submitForm = async (formEl) => {
  if (!formEl) return;

  try {
    await formEl.validate();
    loading.value = true;
    const formTmp = {
      phone: form.phone,
      pwd: md5(form.pwd),
    };
    const data = await login(formTmp);
    if (data.code === "000000") {
      // save
      userStore.setUser({
        id: data.data.id,
        phone: data.data.phone,
        name: data.data.name,
        avatar: data.data.avatar,
      });
      ElMessage.success("登录成功");
      router.push(route.query.redirect || "/");
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
  <div class="login">
    <h2>Vep CMS</h2>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>帐号登录</span>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(formRef)"
            :loading="loading"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  h2 {
    font-size: 28px;
    font-weight: normal;
    font-variant: small-caps;
    color: #666;
  }

  .el-card {
    width: 400px;
    margin-top: 20px;
  }

  form {
    margin-right: 40px;
  }
}
</style>
