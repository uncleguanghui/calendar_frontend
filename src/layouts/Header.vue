<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col :span="4">
        <div class="logo">
          Logo
        </div>
      </a-col>
      <a-col :span="16">
        <a-menu
          theme="light"
          mode="horizontal"
          :defaultSelectedKeys="['/calendar']"
          :style="{ lineHeight: '62px', textAlign: 'left' }"
          @click="clickHandle"
        >
          <a-menu-item key="/calendar">日历</a-menu-item>
          <a-menu-item key="/help">帮助</a-menu-item>
          <a-menu-item key="/about">关于</a-menu-item>
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
  },
  methods: {
    clickHandle({ key }) {
      if (this.$router.currentRoute.path != key) {
        this.$router.push(key);
      }
    }
  }
};
</script>

<style scoped></style>
