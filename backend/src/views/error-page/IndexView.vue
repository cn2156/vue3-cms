<script setup></script>

<template>
  <div class="not-found">
    <h2>Page Not Found.</h2>
    <button @click="$router.push('/')">Goto Home</button>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 150px;

  h2 {
    font-size: 80px;
    color: #ccc;
  }

  button {
    margin-top: 40px;
    padding: 10px 20px;
    font-size: 24px;
    color: #666;
  }
}
</style>
