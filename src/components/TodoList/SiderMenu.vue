<template>
  <div class="page">
    <a-menu
      theme="light"
      mode="vertical"
      :defaultSelectedKeys="['/calendar']"
      :style="{ lineHeight: '62px', textAlign: 'left' }"
      @click="clickHandle"
    >
      <a-menu-item key="today">今天</a-menu-item>
      <a-menu-item key="recentSevenDays">最近7天</a-menu-item>
      <a-menu-item key="all">全部</a-menu-item>
      <a-menu-item key="finished">已完成</a-menu-item>
      <a-menu-item key="overdue">已过期</a-menu-item>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    clickHandle() {}
  }
};
</script>

<style scoped></style>
