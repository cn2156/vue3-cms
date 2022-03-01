<script setup>
import { Expand, Fold, UserFilled } from "@element-plus/icons-vue";

import { useBreadcrumbStore } from "@/stores/breadcrumb";
const breadcrumbStore = useBreadcrumbStore();

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["collapseChange"]);

function handleCollapse() {
  emits("collapseChange", !props.collapsed);
}
</script>

<template>
  <div class="header">
    <div class="action-wrapper" @click="handleCollapse">
      <el-icon v-if="collapsed"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
    </div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbStore.breadcrumbs"
        :key="index"
      >
        <a :href="`#${item.path}`" v-if="item.path">{{ item.title }}</a>
        <span v-else>{{ item.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :icon="UserFilled" :size="30"></el-avatar>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item divided>退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  height: 100%;

  .action-wrapper {
    display: flex;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
  }

  .el-breadcrumb {
    flex: 1;
  }

  .el-avatar {
    cursor: pointer;
  }
}
</style>
