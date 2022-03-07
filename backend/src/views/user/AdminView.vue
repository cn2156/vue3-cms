<script setup>
import { ref, reactive, computed } from "vue";
import configPagination from "../../config/pagination";
import {
  getUsers,
  getFields,
  getAllowBackendsValues,
  getAllowBackends,
  getSourceText,
  getSourceColors,
  getSources,
  getStatusText,
  getStatusColors,
  getStatuses,
  updateUser,
  deleteUser,
} from "../../api/user";

const fields = getFields();
const statuses = getStatuses();
const sources = getSources();
const allowBackends = getAllowBackends();

const loading = ref(false);
const formRef = ref();
const form = reactive({
  phone: "",
  name: "",
  source: "",
  allow_backend: "",
  status: "",
});

const _page = ref(1);
const _limit = ref(configPagination._limit);
const pageSizes = ref(configPagination.pageSizes);
const totalCount = ref(0);

const submitForm = (formEl) => {
  if (!formEl) return;
  _page.value = 1;
  getUserList();
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const dataList = ref([]);
const getUserList = async () => {
  loading.value = true;
  const data = await getUsers({
    phone_like: form.phone, // filter
    name_like: form.name, // filter
    source: form.source,
    allow_backend: form.allow_backend,
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
getUserList();

const sourceText = computed(() => {
  return (value) => getSourceText(value);
});

const statusText = computed(() => {
  return (value) => getStatusText(value);
});

const allowBackendsValues = getAllowBackendsValues();

const sourceColors = getSourceColors();
const statusColors = getStatusColors();
const cellClassName = ({ row, column }) => {
  if (column.property === "source") {
    return sourceColors[row.source] ? "color-" + sourceColors[row.source] : "";
  } else if (column.property === "status") {
    return statusColors[row.status] ? "color-" + statusColors[row.status] : "";
  }
};

import { ElMessage, ElMessageBox } from "element-plus";
const handleAllowBackendChange = (row) => {
  ElMessageBox.confirm("确认更改吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = await updateUser(row);
      if (data.code === "000000") {
        ElMessage.success("更改成功");
      } else {
        row.allow_backend = Number(!row.allow_backend);
        ElMessage.error(data.message);
      }
    })
    .catch(() => {
      row.allow_backend = Number(!row.allow_backend);
    });
};

const handleSizeChange = (val) => {
  _page.value = 1;
  _limit.value = val;
  getUserList();
};

const handleCurrentChange = (val) => {
  _page.value = val;
  getUserList();
};

import { useRouter } from "vue-router";
const router = useRouter();

const handleRead = (row) => {
  router.push({ name: "user-read", params: { id: row.id } });
};

const handleUpdate = (row) => {
  router.push({ name: "user-update", params: { id: row.id } });
};

const handleDelete = (row) => {
  ElMessageBox.confirm("确认删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = await deleteUser(row.id);
      if (data.code === "000000") {
        ElMessage.success("删除成功");
        getUserList();
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
        <span>用户管理</span>
        <el-button
          class="button"
          type="text"
          @click="$router.push({ name: 'user-create' })"
        >
          新建用户
        </el-button>
      </div>
    </template>

    <el-form ref="formRef" :model="form" inline size="small">
      <el-form-item :label="fields.phone" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item :label="fields.name" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item :label="fields.source" prop="source">
        <el-select v-model="form.source" placeholder="请选择">
          <el-option label="请选择" :value="''"></el-option>
          <el-option
            v-for="(source, key) in sources"
            :key="key"
            :label="source"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="fields.allow_backend" prop="allow_backend">
        <el-select v-model="form.allow_backend" placeholder="请选择">
          <el-option label="请选择" :value="''"></el-option>
          <el-option
            v-for="(item, key) in allowBackends"
            :key="key"
            :label="item"
            :value="key"
          ></el-option>
        </el-select>
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
      <el-table-column prop="phone" :label="fields.phone" />
      <el-table-column prop="name" :label="fields.name" />
      <el-table-column prop="avatar" :label="fields.avatar">
        <template #default="scope">
          <img
            v-if="scope.row.avatar"
            :src="scope.row.avatar"
            style="height: 40px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="source" :label="fields.source" align="center">
        <template #default="scope">
          {{ sourceText(scope.row.source) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="allow_backend"
        :label="fields.allow_backend"
        align="center"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.allow_backend"
            :active-value="allowBackendsValues.ENABLED"
            :inactive-value="allowBackendsValues.DISABLED"
            @click="handleAllowBackendChange(scope.row)"
          ></el-switch>
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
