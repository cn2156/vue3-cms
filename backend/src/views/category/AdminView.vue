<script setup>
import { ref, reactive, computed } from "vue";
import configPagination from "../../config/pagination";
import {
  getFields,
  getStatusText,
  getStatusColors,
  getStatuses,
  getCategories,
  getOneLevelCategoryValues,
  deleteCategory,
} from "../../api/category";

const fields = getFields();
const statuses = getStatuses();

const loading = ref(false);
const formRef = ref();
const form = reactive({
  name: "",
  code: "",
  status: "",
});

const _page = ref(1);
const _limit = ref(configPagination._limit);
const pageSizes = ref(configPagination.pageSizes);
const totalCount = ref(0);

const submitForm = (formEl) => {
  if (!formEl) return;
  _page.value = 1;
  getCategoryList();
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const dataList = ref([]);
const getCategoryList = async () => {
  loading.value = true;
  const data = await getCategories({
    name_like: form.name, // filter
    code_like: form.code, // filter
    status: form.status,
    _page: _page.value,
    _limit: _limit.value,
  });
  if (data.code === "000000") {
    dataList.value = data.data;
    totalCount.value = data.total;
  }
  loading.value = false;
};
getCategoryList();

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

const statusText = computed(() => {
  return (value) => getStatusText(value);
});

const statusColors = getStatusColors();
const cellClassName = ({ row, column }) => {
  if (column.property === "status") {
    return statusColors[row.status] ? "color-" + statusColors[row.status] : "";
  }
};

const handleSizeChange = (val) => {
  _page.value = 1;
  _limit.value = val;
  getCategoryList();
};

const handleCurrentChange = (val) => {
  _page.value = val;
  getCategoryList();
};

import { useRouter } from "vue-router";
const router = useRouter();

const handleRead = (row) => {
  router.push({ name: "category-read", params: { id: row.id } });
};

const handleUpdate = (row) => {
  router.push({ name: "category-update", params: { id: row.id } });
};

import { ElMessage, ElMessageBox } from "element-plus";

const handleDelete = (row) => {
  ElMessageBox.confirm("确认删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = await deleteCategory(row.id);
      if (data.code === "000000") {
        ElMessage.success("删除成功");
        getCategoryList();
      } else {
        ElMessage.error(data.message);
      }
    })
    .catch(() => {});
};
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header flex flex-between flex-middle">
        <span>栏目管理</span>
        <el-button
          class="button"
          type="text"
          @click="$router.push({ name: 'category-create' })"
        >
          新建栏目
        </el-button>
      </div>
    </template>

    <el-form ref="formRef" :model="form" inline size="small">
      <el-form-item :label="fields.name" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item :label="fields.code" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item :label="fields.status" prop="status">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option label="请选择" :value="''"></el-option>
          <el-option
            v-for="(item, key) in statuses"
            :key="key"
            :label="item"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm(formRef)"
          :loading="loading"
        >
          搜索
        </el-button>
        <el-button @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      border
      stripe
      :header-cell-style="{ textAlign: 'center' }"
      :cell-class-name="cellClassName"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" :label="fields.id" width="80" />
      <el-table-column prop="display_order" :label="fields.display_order" />
      <el-table-column prop="name" :label="fields.name" />
      <el-table-column prop="code" :label="fields.code" />
      <el-table-column prop="parent_id" :label="fields.parent_id">
        <template #default="scope">
          {{ parentText(scope.row.parent_id) }}
        </template>
      </el-table-column>
      <el-table-column prop="cover_img" :label="fields.cover_img">
        <template #default="scope">
          <img
            v-if="scope.row.cover_img"
            :src="scope.row.cover_img"
            style="height: 40px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="fields.status" align="center">
        <template #default="scope">
          {{ statusText(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleRead(scope.row)">
            查看
          </el-button>
          <el-button
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >
            更新
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="mt20"
      v-model:currentPage="_page"
      v-model:page-size="_limit"
      :page-sizes="pageSizes"
      :disabled="loading"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-card>
</template>

<style scoped lang="scss"></style>
