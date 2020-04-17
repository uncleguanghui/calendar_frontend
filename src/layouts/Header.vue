<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col :span="4">
        <div class="logo">Logo</div>
      </a-col>
      <a-col :span="16">
        <a-menu
          theme="light"
          mode="horizontal"
          :defaultSelectedKeys="['1']"
          :style="{ lineHeight: '64px', textAlign: 'left' }"
        >
          <a-menu-item key="1">日历</a-menu-item>
          <a-menu-item key="2">帮助</a-menu-item>
          <a-menu-item key="3">关于</a-menu-item>
        </a-menu>
      </a-col>
      <a-col :span="2">通知</a-col>
      <a-col :span="2">用户</a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped></style>
