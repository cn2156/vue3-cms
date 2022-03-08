<script setup>
import { ref, computed } from "vue";
import {
  getFields,
  getStatusText,
  getStatusColors,
  getCategory,
  getOneLevelCategoryValues,
} from "../../api/category";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const categoryInfo = ref({});
const getCategoryInfo = async () => {
  const data = await getCategory({ id: props.id });
  if (data.code === "000000") {
    categoryInfo.value = data.data;
  }
};
getCategoryInfo();

const oneLevelCategoryValues = ref([]);
const getOneLevelCategoryList = async () => {
  const data = await getOneLevelCategoryValues();
  if (data.code === "000000") {
    oneLevelCategoryValues.value = data.data;
  }
};
getOneLevelCategoryList();

const parentText = computed(() => {
  return (value) => oneLevelCategoryValues.value[value];
});

const fields = getFields();
const statusText = computed(() => {
  return (value) => getStatusText(value);
});
const statusColors = getStatusColors();
const statusColor = computed(() =>
  statusColors[categoryInfo.value.status]
    ? "color-" + statusColors[categoryInfo.value.status]
    : ""
);
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header flex flex-between flex-middle">
        <span>查看栏目</span>
        <el-button class="button" type="text" @click="$router.go(-1)">
          返回
        </el-button>
      </div>
    </template>
    <el-descriptions :column="1" border>
      <el-descriptions-item
        :label="fields.id"
        label-class-name="description-label"
      >
        {{ categoryInfo.id }}
      </el-descriptions-item>
      <el-descriptions-item :label="fields.name">
        {{ categoryInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item :label="fields.code">
        {{ categoryInfo.code }}
      </el-descriptions-item>
      <el-descriptions-item :label="fields.parent_id">
        {{ parentText(categoryInfo.parent_id) }}
      </el-descriptions-item>
      <el-descriptions-item :label="fields.cover_img">
        <img
          v-if="categoryInfo.cover_img"
          :src="categoryInfo.cover_img"
          style="height: 40px"
        />
      </el-descriptions-item>
      <el-descriptions-item :label="fields.display_order">
        {{ categoryInfo.display_order }}
      </el-descriptions-item>
      <el-descriptions-item :label="fields.status">
        <span :class="[statusColor]">{{
          statusText(categoryInfo.status)
        }}</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<style scoped lang="scss"></style>
