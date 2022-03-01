<script setup>
import LayoutAside from "./components/LayoutAside.vue";
import LayoutHeader from "./components/LayoutHeader.vue";
import { ref } from "vue";

const collapsed = ref(false);
function handleCollapse(value) {
  collapsed.value = value;
}
</script>

<template>
  <el-container class="wrapper">
    <el-aside :class="{ collapsed: collapsed }">
      <LayoutAside :collapsed="collapsed" />
    </el-aside>
    <el-container>
      <el-header>
        <LayoutHeader
          :collapsed="collapsed"
          @collapse-change="handleCollapse"
        />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.wrapper {
  height: 100%;

  .el-aside {
    width: 200px;
    background-color: #545c64;
  }
  .collapsed {
    width: 64px;
  }

  .el-header {
    background-color: #f9f9f9;
  }
}
</style>
