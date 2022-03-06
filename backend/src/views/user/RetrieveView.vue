<script setup>
import { ref, computed } from "vue";
import {
  getUser,
  getAllowBackendsValues,
  getSourceText,
  getSourceColors,
  getStatusText,
  getStatusColors,
} from "@/api/user";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const getUserInfo = async () => {
  const data = await getUser({ id: props.id });
  if (data.code === "000000") {
    userInfo.value = data.data;
  }
};

const userInfo = ref({});
getUserInfo();

const sourceText = computed(() => {
  return (value) => getSourceText(value);
});
const sourceColors = getSourceColors();
const sourceColor = computed(() =>
  sourceColors[userInfo.value.source]
    ? "color-" + sourceColors[userInfo.value.source]
    : ""
);

const allowBackendsValues = getAllowBackendsValues();
const handleChange = () => false;

const statusText = computed(() => {
  return (value) => getStatusText(value);
});
const statusColors = getStatusColors();
const statusColor = computed(() =>
  statusColors[userInfo.value.status]
    ? "color-" + statusColors[userInfo.value.status]
    : ""
);
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header flex flex-between flex-middle">
        <span>用户信息</span>
        <el-button class="button" type="text" @click="$router.go(-1)">
          返回
        </el-button>
      </div>
    </template>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="ID" label-class-name="description-label">{{
        userInfo.id
      }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{
        userInfo.phone
      }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{
        userInfo.name
      }}</el-descriptions-item>
      <el-descriptions-item label="头像"
        ><img
          v-if="userInfo.avatar"
          :src="userInfo.avatar"
          style="height: 40px"
      /></el-descriptions-item>
      <el-descriptions-item label="来源">
        <span :class="[sourceColor]">{{ sourceText(userInfo.source) }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="允许登录后台">
        <el-switch
          v-model="userInfo.allow_backend"
          :active-value="allowBackendsValues.ENABLED"
          :inactive-value="allowBackendsValues.DISABLED"
          :before-change="handleChange"
        ></el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <span :class="[statusColor]">{{ statusText(userInfo.status) }}</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<style scoped lang="scss"></style>
