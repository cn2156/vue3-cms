<script setup>
import { ref, reactive, computed } from "vue";
import configPagination from "../../config/pagination";
import {
  getRoles,
  getFields,
  getStatusText,
  getStatusColors,
  getStatuses,
  deleteRole,
} from "../../api/role";

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
  getRoleList();
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const dataList = ref([]);
const getRoleList = async () => {
  loading.value = true;
  const data = await getRoles({
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
getRoleList();

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
  getRoleList();
};

const handleCurrentChange = (val) => {
  _page.value = val;
  getRoleList();
};

const dialogFormVisible = ref(false);
const dialogTitle = ref("");
const dialogAction = ref("");
const updateId = ref(0);

const createUpdateForm = ref();
import FormViewVue from "./components/FormView.vue";

const handleSave = () => {
  createUpdateForm.value.submitForm();
};

const handleSuccess = () => {
  if (!updateId.value) {
    _page.value = 1;
  }
  getRoleList();
  handleClose();
};

const handleBeforeClose = (done) => {
  handleClose();
  done();
};

const handleClose = () => {
  updateId.value = 0;
  createUpdateForm.value.resetForm();
  dialogFormVisible.value = false;
};

const handleCreate = () => {
  dialogFormVisible.value = true;
  dialogTitle.value = "添加角色";
  dialogAction.value = "create";
};

const handleUpdate = (row) => {
  dialogFormVisible.value = true;
  dialogTitle.value = "更新角色";
  updateId.value = row.id;
  dialogAction.value = "update";
};

import { useRouter } from "vue-router";
const router = useRouter();

const handleAllocateResource = (row) => {
  router.push({ name: "role-resource", params: { id: row.id } });
};

import { ElMessage, ElMessageBox } from "element-plus";
const handleDelete = (row) => {
  ElMessageBox.confirm("确认删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const data = await deleteRole(row.id);
      if (data.code === "000000") {
        ElMessage.success("删除成功");
        getRoleList();
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
        <span>角色管理</span>
        <el-button class="button" type="text" @click="handleCreate">
          添加角色
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
      <el-table-column prop="name" :label="fields.name" />
      <el-table-column prop="code" :label="fields.code" />
      <el-table-column prop="status" :label="fields.status" align="center">
        <template #default="scope">
          {{ statusText(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button size="small" @click="handleAllocateResource(scope.row)">
            分配资源
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

    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogTitle"
      :before-close="handleBeforeClose"
    >
      <FormViewVue
        ref="createUpdateForm"
        :id="updateId"
        @submit-success="handleSuccess"
      />
      <template #footer>
        <span class="dialog-footer">
          <template
            v-if="dialogAction === 'create' || dialogAction === 'update'"
          >
            <el-button @click="handleClose"> 取消 </el-button>
            <el-button type="primary" @click="handleSave"> 保存 </el-button>
          </template>
          <el-button
            v-if="dialogAction === 'read'"
            @click="dialogFormVisible = false"
          >
            关闭
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped lang="scss"></style>
