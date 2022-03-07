<script setup>
import { ref, reactive, computed, watch } from "vue";
import {
  getFields,
  getStatuses,
  getStatusDefaultValue,
  getRole,
} from "../../../api/role";

const props = defineProps({
  id: {
    type: [String, Number],
    default: "",
  },
});

const fields = getFields();
const statuses = getStatuses();

const loading = ref(false);
const formRef = ref();
let form = ref({
  name: "",
  code: "",
  status: getStatusDefaultValue(),
});

const getRoleInfo = async (id) => {
  const data = await getRole({ id });
  if (data.code === "000000" && data.data) {
    form.value = data.data;
  }
};

const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  formRef.value.clearValidate();
};

const idTmp = computed(() => props.id);
watch(
  idTmp,
  (newValue) => {
    if (newValue) {
      getRoleInfo(props.id);
    }
  },
  { immediate: true }
);

const rules = reactive({
  name: [
    {
      required: true,
      message: "请输入角色",
      trigger: "blur",
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

import { createOrUpdateRole } from "../../../api/role";
import { ElMessage } from "element-plus";

const emits = defineEmits(["submit-success"]);

const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;
    const data = await createOrUpdateRole(form.value);
    if (data.code === "000000") {
      ElMessage.success("保存成功");
      resetForm(formRef.value);
      emits("submit-success");
    } else {
      ElMessage.error(data.message);
    }
    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

defineExpose({
  submitForm,
  resetForm,
});
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item :label="fields.name" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item :label="fields.code" prop="code">
      <el-input v-model="form.code"></el-input>
    </el-form-item>
    <el-form-item :label="fields.status" prop="status">
      <el-select v-model="form.status" placeholder="请选择状态">
        <el-option
          v-for="(status, key) in statuses"
          :key="key"
          :label="status"
          :value="key"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
