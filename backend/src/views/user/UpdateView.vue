<script setup>
import FormView from "./components/FormView.vue";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header flex flex-between flex-middle">
        <span>更新用户</span>
        <el-button class="button" type="text" @click="$router.go(-1)">
          返回
        </el-button>
      </div>
    </template>
    <FormView :id="props.id"></FormView>
  </el-card>
</template>

<style scoped lang="scss"></style>
