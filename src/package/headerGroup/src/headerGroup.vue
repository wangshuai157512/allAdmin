<template>
    <div class="header-box">
      <slot></slot>
    </div>
</template>

<script>
    export default {
      name: "headerGroup"
    }
</script>

<style scoped>
  .header-box {
    padding: 0 0 20px;
  }
</style>
