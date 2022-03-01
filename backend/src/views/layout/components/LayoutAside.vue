<script setup>
import {
  Menu as IconMenu,
  DocumentCopy,
  Document,
  ChatLineSquare,
  User,
  View,
  Setting,
  Collection,
  Sunrise,
  Flag,
} from "@element-plus/icons-vue";

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="logo">Vep CMS</div>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    text-color="#fff"
    unique-opened
    router
    :collapse="collapsed"
    :collapse-transition="false"
  >
    <el-sub-menu index="content">
      <template #title>
        <el-icon><DocumentCopy /></el-icon>
        <span>内容管理</span>
      </template>
      <el-menu-item index="/">
        <el-icon><Document /></el-icon>
        <span>栏目一</span>
      </el-menu-item>
      <el-menu-item index="/">
        <el-icon><Document /></el-icon>
        <span>栏目二</span>
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/comment">
      <el-icon><ChatLineSquare /></el-icon>
      <span>评论管理</span>
    </el-menu-item>
    <el-menu-item index="/likes">
      <el-icon><Sunrise /></el-icon>
      <span>点赞管理</span>
    </el-menu-item>
    <el-menu-item index="/favorite">
      <el-icon><Flag /></el-icon>
      <span>收藏管理</span>
    </el-menu-item>
    <el-sub-menu index="setting">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/category">
        <el-icon><IconMenu /></el-icon>
        <span>栏目管理</span>
      </el-menu-item>
      <el-menu-item index="/resource">
        <el-icon><Collection /></el-icon>
        <span>资源管理</span>
      </el-menu-item>
      <el-menu-item index="/role">
        <el-icon><View /></el-icon>
        <span>角色管理</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  color: #f0f0f0;
  text-align: center;
  font-variant: small-caps;
  background-color: #444c53;
}
.el-menu {
  border-right: none;
}
</style>
