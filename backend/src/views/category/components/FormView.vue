<script setup>
import { ref, reactive } from "vue";
import UploadFile from "@/components/UploadFile.vue";
import {
  getFields,
  getStatuses,
  getStatusDefaultValue,
  getCategory,
  getOneLevelCategories,
  createOrUpdateCategory,
} from "../../../api/category";

const props = defineProps({
  id: {
    type: [String, Number],
    default: "",
  },
});

const oneLevelCategories = ref([]);
const getOneLevelCategoryList = async () => {
  const data = await getOneLevelCategories();
  if (data.code === "000000") {
    oneLevelCategories.value = data.data;
  }
};
getOneLevelCategoryList();

const fields = getFields();
const statuses = getStatuses();

const loading = ref(false);
const formRef = ref();
let form = ref({
  name: "",
  code: "",
  parent_id: 0,
  cover_img: "",
  display_order: 0,
  status: getStatusDefaultValue(),
});

const getCategoryInfo = async (id) => {
  const data = await getCategory({ id });
  if (data.code === "000000" && data.data) {
    form.value = data.data;
  }
};
if (props.id) {
  getCategoryInfo(props.id);
}

const rules = reactive({
  name: [
    {
      required: true,
      message: "请输入栏目名称",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "请输入栏目编码",
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

import { useRouter } from "vue-router";
const router = useRouter();

import { ElMessage } from "element-plus";

const submitForm = async (formEl) => {
  if (!formEl) return;

  try {
    await formEl.validate();
    loading.value = true;
    const data = await createOrUpdateCategory(form.value);
    if (data.code === "000000") {
      ElMessage.success("保存成功");
      router.push({ name: "category" });
    } else {
      ElMessage.error(data.message);
    }
    loading.value = false;
  } catch (err) {
    console.log(err);
  }
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item :label="fields.name" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item :label="fields.code" prop="code">
      <el-input v-model="form.code"></el-input>
    </el-form-item>
    <el-form-item :label="fields.parent_id" prop="parent_id">
      <el-select v-model="form.parent_id" placeholder="请选择">
        <el-option label="请选择" :value="0"></el-option>
        <el-option
          v-for="item in oneLevelCategories"
          :key="item.id"
          :label="item.nameWithStatus"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="fields.cover_img" prop="cover_img">
      <UploadFile v-model="form.cover_img" />
    </el-form-item>
    <el-form-item :label="fields.display_order" prop="display_order">
      <el-input type="number" v-model="form.display_order"></el-input>
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
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)" :loading="loading">
        保 存
      </el-button>
      <el-button v-if="!form.id" @click="resetForm(formRef)"> 重 置 </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
