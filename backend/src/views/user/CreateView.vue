<script setup>
import FormView from "./components/FormView.vue";
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header flex flex-between flex-middle">
        <span>添加用户</span>
        <el-button class="button" type="text" @click="$router.go(-1)">
          返回
        </el-button>
      </div>
    </template>
    <FormView></FormView>
  </el-card>
</template>

<style scoped lang="scss"></style>
